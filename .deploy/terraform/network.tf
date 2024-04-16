# resource "azurerm_resource_group" "example" {
#   name     = "example-resources"
#   location = "West Europe"
# }

# resource "azurerm_virtual_network" "example" {
#   name                = "example-vnet"
#   address_space       = ["10.7.29.0/29"]
#   location            = azurerm_resource_group.example.location
#   resource_group_name = azurerm_resource_group.example.name
# }

# resource "azurerm_subnet" "internal" {
#   name                 = "internal"
#   resource_group_name  = azurerm_resource_group.example.name
#   virtual_network_name = azurerm_virtual_network.example.name
#   address_prefixes     = ["10.7.29.0/29"]
#   service_endpoints    = ["Microsoft.Sql"]
# }

# resource "azurerm_postgresql_server" "example" {
#   name                = "postgresql-server-1"
#   location            = azurerm_resource_group.example.location
#   resource_group_name = azurerm_resource_group.example.name

#   sku_name = "GP_Gen5_2"

#   storage_mb            = 5120
#   backup_retention_days = 7


#   administrator_login          = "psqladmin"
#   administrator_login_password = "H@Sh1CoR3!"
#   version                      = "9.5"
#   ssl_enforcement_enabled      = true
# }





# resource "azurerm_postgresql_virtual_network_rule" "example" {
#   name                                 = "postgresql-vnet-rule"
#   resource_group_name                  = azurerm_resource_group.example.name
#   server_name                          = azurerm_postgresql_server.example.name
#   subnet_id                            = azurerm_subnet.internal.id
#   ignore_missing_vnet_service_endpoint = true
# }