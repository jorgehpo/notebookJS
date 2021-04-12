# notebookJS: seamless JavaScript integration in Python Notebooks 

<img src="https://raw.githubusercontent.com/jorgehpo/notebookJS/main/Images/notebookJS.png" 
     align="left" 
     hspace="10" 
     vspace="6"
     width="100"
     height="120">

*notebookJS* enables the execution of custom JavaScript code in Python Notebooks (Jupyter Notebook and Google Colab). This Python library can be useful for implementing and reusing  interactive Data Visualizations in Notebook environments.

*notebookJS* supports bidirectional communication between Python and JavaScript. User interactions in HTML/JavaScript can trigger Python callbacks that process data on demand and send the results back to the front-end code.


## Install

To install, run:
`pip install notebookjs`

Or clone this repository and run:
`python setup.py install`

## API

The *notebookJS* API consists of a single method: *execute_js*. This method executes a javascript function and sets up the infrastructure for bidirectional communication between Python and Javascript using callbacks. 

```python
execute_js(
    library_list,
    main_function,
    data_dict={},
    callbacks={},
    css_list=[],
)
```

**Parameters**
- library_list : list of str
    List of strings containing either 1) URL to a javascript library, 2) javascript code
- main_function : str
    Name of the main function to be called. The function will be called with two parameters: 
    <div_id>, for example "#my_div", and <data_dict>.
- data_dict : dict
    Dictionary containing the data to be passed to <main_function>
- callbacks : dict
    Dictionary of the form {<callback_str_id> : <python_function>}. The javascript library can
    use callbacks to talk to python.
- css_list : list of str
    List of strings containing either 1) URL to a CSS stylesheet or 2) CSS styles

## Examples

For examples, please see the [Examples/](https://github.com/jorgehpo/notebookJS/blob/main/Examples/) folder.



![Radial Bar Chart](https://raw.githubusercontent.com/jorgehpo/notebookJS/main/Images/example_radial_bar.png)
**Figure 1**: Radial Bar Chart of an energy consumption dataset. Adapted from this [bl.ock](https://bl.ocks.org/AntonOrlov/6b42d8676943cc933f48a43a7c7e5b6c). See [Examples/3_RadialBarChart](https://github.com/jorgehpo/notebookJS/blob/main/Examples/3_RadialBarChart/).


## Reference

If you use *notebookJS*, please reference the following work:

"*Interactive Data Visualization in Jupyter Notebooks*. JP Ono, J Freire, CT Silva - Computing in Science & Engineering, 2021"
