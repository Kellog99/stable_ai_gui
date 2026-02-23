import { InfoUploader } from "@/interfaces/homePageInterface";


export const infoModel: InfoUploader =
{
    description: "The zip you are going to upload must contain the <b>.pth</b> file and a json config file.",
    scaffholding: { "modelName.zip": ["model.pth", "modelName.json"] },
    fields:
        [
            {
                field: "name",
                type: "string",
                description: 'The name of the model. This field in mandatory.'
            },
            {
                field: "type",
                type: "string",
                description: "Specify the type of the model. E.g., <b>timm</b> for models from the timm library."
            },
            {
                field: "pretrained",
                type: "boolean",
                description: "Whether the model is pretrained or not."
            },

            {
                field: "num_classes",
                type: "number",
                description: "Specify the number of classes for the model."
            },
            {
                field: "task",
                type: "string",
                description: `Specify the task for the model. E.g., <b>classification</b>, <b>object detection</b>, etc.`
            }
        ],
    example: {
        "name": "resnet50c",
        "type": "timm",
        "pretrained": true,
        "num_classes": 1000,
        "task": "classification"
    }
}



export const infoDataset: InfoUploader = {
    description: "The zip you are going to upload must contain the raw data files and a json config file.",
    scaffholding: { "datasetName.zip": ["data", "datasetName.json"] },
    fields: [
        {
            field: "name",
            type: "string",
            description: "Name of the dataset."
        },
        {
            field: "description",
            type: "string",
            description: "A short description of the dataset."
        },
        {
            field: "num_classes",
            type: "number",
            description: "The total number of classes in the dataset (applicable for classification tasks)."
        },
        {
            field: "subset",
            type: "number",
            description: "Optional: Number of samples to use from the full dataset for testing or quick experiments."
        },
        {
            field: "batch",
            type: "number",
            description: "Batch size to be used during training or inference."
        },
        {
            field: "type_dataset",
            type: "number",
            description: "To define..."
        },
        {
            field: "type",
            type: "string",
            description: "The type of the main feature of the dataset, e.g. <b>image</b>, <b>text</b>, etc.</>"
        },
        {
            field: "mode",
            type: "string",
            description: "The task mode of the dataset, e.g., <b>classification</b>, <b>object detection</b> or <b>single feature</b>.</>"
        },
        {
            field: "num_workers",
            type: "number",
            description: "Number of worker threads to use for data loading."
        },
        {
            field: "source_path",
            type: "string",
            description: "to define"
        },
        {
            field: "transform_config",
            type: "object",
            description: "Configuration object for data transformations and preprocessing.",
            properties: [
                {
                    field: "size",
                    type: "number",
                    description: "Target size to which images will be resized."
                },
                {
                    field: "crop",
                    type: "number",
                    description: "Size of the crop to be applied after resizing."
                },
                {
                    field: "transform_id",
                    type: "string",
                    description: "Identifier for a predefined transformation pipeline, e.g., 'imagenet_like_crop'."
                },
                {
                    field: "mean",
                    type: "array",
                    description: "Mean values for each channel used in normalization."
                },
                {
                    field: "std",
                    type: "array",
                    description: "Standard deviation values for each channel used in normalization."
                }
            ]
        }
    ],
    example: {
        "name": "animals",
        "description": "Animals!",
        "num_classes": 90,
        "subset": 20,
        "batch": 2,
        "type_dataset": 2,
        "type": "image",
        "mode": "classification",
        "num_workers": 0,
        "source_path": "C:/.../datasets/animals/data",
        "transform_config": {
            "size": 256,
            "crop": 224,
            "transform_id": "imagenet_like_crop",
            "mean": [
                0.5074,
                0.5308,
                0.5306
            ],
            "std": [
                0.2639,
                0.2518,
                0.2521
            ]
        }
    }
}
