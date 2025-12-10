# Trustworty GUI
This repository represent the Application for testing the worthyness of a dataset and a Deep Learning model.


* **Homepage**:
    * **Red Tool**: Contains all the element for testing an AI model.
        * **Benchmark**: it executes the benchmark for a specified model. It executes independent jobs which are different vulnerabilities to test.

            [output]: a `JSON` file that is automatically shown in the `Report` page.
        * **Test**: it execute a vulnerability on a given model and input.
    * **Data Analysis**: it tests all the metrics for analyzing a dataset.
* **Report**: it is the page where it is possible to show all the reports.


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

   ```json
   { 
    {
        "name": "Dataset1_task1",
        "color": "color1",
        "data": [
        {"params": numero_parametri_1, "*nome_metrica": valore_1},
        {"params": numero_parametri_2, "*nome_metrica": valore_2},
        {"params": numero_parametri_3, "*nome_metrica": valore_3}
        ]
    },
        {
        "name": "Dataset1_task2",
        "color": "color2",
        "data": [
        {"params": numero_parametri_1, "*nome_metrica": valore_1},
        {"params": numero_parametri_2, "*nome_metrica": valore_2},
        {"params": numero_parametri_3, "*nome_metrica": valore_3}
        ]
        }
   }
    ```



