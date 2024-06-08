import _ from "lodash";

// Recursively finds and returns entries of a specific instance type from the provided object.
// It constructs the keys in a way that reflects the structure of the object,
// suitable for FormData.
export default function extractInstances(payload, instanceType, baseKey = "") {
    const instances = _.transform(
        payload,
        (result, value, key) => {
            // For arrays, the key will be the index, so we construct the path appropriately
            // using dot notation for objects or square brackets for array indices.
            let currentKey = Array.isArray(payload)
                ? `${baseKey}[${key}]`
                : baseKey ? `${baseKey}.${key}` : key;

            // If the value is an plain object or array, recursively process it
            if (_.isPlainObject(value) || Array.isArray(value)) {
                result.push(...extractInstances(value, instanceType, currentKey));
                return;
            }

            // If the value is an instance of the specified type, add it to the result list
            if (value instanceof instanceType) {
                result.push([currentKey, value]);
            }
        },
        []
    );

    // Removes entries from the source object, based on the keys found in the instances list.
    // This is used to prepare the non-instance part of the object for JSON serialization.
    instances.forEach(([path]) => _.unset(payload, path));

    return instances;
}
