resource "random_string" "random" {
  length  = 24
  special = false
  upper   = false
  lower   = true
}

# Crear un grupo de recursos
resource "azurerm_resource_group" "agape" {
  name     = "agape-resources"
  location = "East US"

  tags = {
    environment = "Demo"
  }
}
# https://www.avg.com/es/signal/public-vs-private-ip-address
resource "azurerm_virtual_network" "agape" {
  name                = "agape-vnet"
  address_space       = ["10.1.0.0/16"]
  location            = azurerm_resource_group.agape.location
  resource_group_name = azurerm_resource_group.agape.name
}

resource "azurerm_subnet" "agape" {
  name                 = "agape-subnet"
  resource_group_name  = azurerm_resource_group.agape.name
  virtual_network_name = azurerm_virtual_network.agape.name
  address_prefixes     = ["10.1.0.0/16"]
}

# https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster
resource "azurerm_kubernetes_cluster" "agape" {
  name                              = "agape-aks"
  location                          = azurerm_resource_group.agape.location
  resource_group_name               = azurerm_resource_group.agape.name
  dns_prefix                        = "agape-k8s"
  role_based_access_control_enabled = true

  default_node_pool {
    name           = "agentpool"
    node_count     = 1
    vm_size        = "Standard_D2_v2"
    vnet_subnet_id = azurerm_subnet.agape.id
  }

  linux_profile {
    admin_username = "ubuntu"

    ssh_key {
      key_data = file("C:\\Users\\win\\.ssh\\id_rsa.pub")
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = "Demo"
  }
}

# # Crear la cuenta de almacenamiento
resource "azurerm_storage_account" "agape" {
  name                     = random_string.random.result
  resource_group_name      = azurerm_resource_group.agape.name
  location                 = azurerm_resource_group.agape.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

output "storage_uri" {
  sensitive = true
  value     = azurerm_storage_account.agape.primary_blob_connection_string
}

# Crear una instancia de Azure Database for PostgreSQL
resource "azurerm_postgresql_server" "agape" {
  name                = "agape-postgres-server"
  location            = azurerm_resource_group.agape.location
  resource_group_name = azurerm_resource_group.agape.name

  sku_name                     = "GP_Gen5_2"
  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = "postgresadmin"
  administrator_login_password = "ComplexPassword123!"

  version = "11"

  ssl_enforcement_enabled = true
  public_network_access_enabled = true
}

resource "azurerm_postgresql_firewall_rule" "aks" {
  name                = "aks"
  resource_group_name = azurerm_postgresql_server.agape.resource_group_name
  server_name         = azurerm_postgresql_server.agape.name
  start_ip_address    = "10.1.0.0"
  end_ip_address      = "10.1.255.255"
}

resource "azurerm_private_endpoint" "postgres" {
  name                = "agape-private-endpoint"
  location            = azurerm_resource_group.agape.location
  resource_group_name = azurerm_resource_group.agape.name
  subnet_id           = azurerm_subnet.agape.id

  private_service_connection {
    name                           = "psc-agape-postgres"
    private_connection_resource_id = azurerm_postgresql_server.agape.id
    subresource_names              = ["postgresqlServer"]
    is_manual_connection           = false
  }
}

# # Crear una base de datos en el servidor PostgreSQL
resource "azurerm_postgresql_database" "agape" {
  name                = "agapedb"
  resource_group_name = azurerm_resource_group.agape.name
  server_name         = azurerm_postgresql_server.agape.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}

output "postgres_connection_uri" {
  value     = "postgresql://${azurerm_postgresql_server.agape.administrator_login}@${azurerm_postgresql_server.agape.name}:${azurerm_postgresql_server.agape.administrator_login_password}@${azurerm_postgresql_server.agape.fqdn}/${azurerm_postgresql_database.agape.name}?sslmode=require"
  sensitive = true
}
























resource "null_resource" "apply_k8s_manifest" {
  depends_on = [
    azurerm_kubernetes_cluster.agape,
  ]

  provisioner "local-exec" {
    when       = create
    on_failure = continue

    command = "PowerShell -NoProfile -ExecutionPolicy Bypass -File C:\\Users\\win\\github.com\\agape-app-react\\.deploy\\k8s\\apply.ps1"

    environment = {
      KUBECONFIG_CONTENTS = azurerm_kubernetes_cluster.agape.kube_config_raw
    }
  }
}
