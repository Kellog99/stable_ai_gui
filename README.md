# Trustworty GUI
This repository represent the Application for testing the worthyness of a dataset and a Deep Learning model.

## Organization
The files' organization for this application follows this organization:

* **Tasks**: this folder container all the possible actions that can be done with a model and a dataset.
  * **Red Tool**: Contains all the element for testing an AI model.
      * **Benchmark**: it executes the benchmark for a specified *(dataset, model)* by executing a series of indepedent jobs. The output is a `JSON` file that is automatically shown in the `Report` page.
      * **Test**: it executes a vulnerability on a given model previously loaded and input image which is loaded by the user in that page.
  * **Data Analysis**: it tests all the metrics for analyzing a dataset.
    * **actions**
    * **dataset**
    * **embeddings**
    * **metrics**
    * **prototypes**
* **Report**: this page is dedicated to handle all the reports that have been produced by the application and all the reports that have been stored. Moreover, it has the possibility to print the model's report in a pdf.
  * **TITANNReport**: this pages is dedicated to the creation of the web page of the titann's report.
  *  **DataQualityReport**: this pages is dedicated to the creation of the web page of the dq's report.

## Information
All the application is based on the following 3 interfaces that describe all the files that are stored and the model and the dataset that could be loaded in the application.

```javascript
interface Info{
  id: string                        // id for the file identification.
  name: string,                     // File's name, ex. "Resnet50" or "Imagenette".
  image?: string | null,            // an image that represents the file.
  task: string,                     // task associated with, i.e. classification, detection, etc.
  domain: string,                   // Domain of the file, i.e. RGB, ultraviolet, etc.
  classes?: number,                 // number of classes in the output.
  weights?: number,                 // Size of the file.
  description?: string,             // description of the file.
  input_dimensionality: number[]    // dimensionality of each input or domain's dimensionality.
}

// Model's information
interface ModelInfo extends Info{
  dataset: string,                  // Dataset where the model had been optimized on 
  parameters: string | null,        // Number of the models' parameters
}

// Dataset's information
interface DatasetInfo extends Info{
  num_sample: number,               // Number of samples, i.e. length of the dataset
}
```

## Report
This page is dedicated to show the report of the two modules present here:
1. `TITANN`
2. `Data Quality`

### TITANN Report
The part dedicated to show the report. The functionalities that are executed is based on two steps:
1. The **leaderboard**: execute a backend call with the following parameters:`(metric_name, task, dataset)`. Where:
   * `metric_name`: it is a unique string identifying the metric that creates the leaderboard. 
     * **Type** = string
     * **Default** = the first metric that can be extracted.

   * `task`: this is a list of strings (perhaps there is a better choice) representing a combination of the following strings: ‘classification’, ‘object-detection’, “segmentation”, ‘regression’. [I am also including regression because we may do this in the future. If you want to add other tasks, feel free to do so].
     * **Type** = list
     * **Default** = task belonging to the tested model.

   * `Dataset`: as with task, it represents a combination of all the various datasets on which the tool has been used. [Let's also consider the case where (task, dataset) is selected but the dataset makes no sense for that task? E.g. (segmentation, MNIST)]. 
     * **Type** = list
     * **Default** = all the available dataset.
2. Il **backend** it return a dictionary that comes from the filtering of the results by task and dataset, in the following form:
