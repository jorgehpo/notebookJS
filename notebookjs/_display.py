from IPython.core.display import display, HTML, Javascript
from string import Template, ascii_uppercase
import pkg_resources
import random
import re
import json
from ._comm import setup_comm_api

def id_generator(size=15):
    """Helper function to generate random div ids."""
    chars = list(ascii_uppercase)
    return ''.join(random.choice(chars) for i in range(size))

def make_html(library_list, main_function, parameter_dict, css_list):
    """Makes the HTML that will be added to the Notebook"""
    # Loading Python CommAPI
    comm_api_path = pkg_resources.resource_filename(__name__, "resources/CommAPI.js")
    with open(comm_api_path, "r") as f:
        comm_api_js = f.read()

    # Making sure library_list and css_list are lists.
    if type(library_list) is not list: 
        library_list = [library_list]
    if type(css_list) is not list:
        css_list = [css_list]
    
    # Downloading web resources
    for idx in range(len(library_list)):
        if check_url(library_list[idx]):
            library_list[idx] = download_url(library_list[idx])
    for idx in range(len(css_list)):
        if check_url(css_list[idx]):
            css_list[idx] = download_url(css_list[idx])

    # Adding CommAPI to library_list 
    library_list.insert(0, comm_api_js)

    # Generating HTML
    div_id = id_generator()
    library_bundle = '\n\n'.join(library_list)
    css_bundle = '\n'.join(css_list)
    template_path = pkg_resources.resource_filename(__name__, "resources/template.html")
    with open(template_path, "r") as f:
        html_all_template = f.read()
        html_all_template = Template(html_all_template)

    return html_all_template.substitute(div_id=div_id, 
                                        library_bundle=library_bundle, 
                                        main_function=main_function, 
                                        parameter_dict=json.dumps(parameter_dict),
                                        css_bundle=css_bundle)

# Regex expression to test if a string is a URL
regex_url = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

def check_url(string):
    """Checks if the string argument is a URL"""
    return re.match(regex_url, string) is not None

def download_url(url):
    """Downloads a URL file as a browser."""
    import requests
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0'}
    r = requests.get(url, headers=headers, stream=False)
    return r.content.decode("utf-8") 



def save_html(html_dest, library_list, main_function, data_dict = {}, callbacks = None, css_list=[]):
    """Saves the bundled code (output of execute_js) to an HTML file

    Parameters
    ----------
    html_dest : str
        Path to the output HTML dest file. Example: "./output.html"
    library_list : list of str
        List of strings containing either 1) URL to a javascript library, 2) javascript code
    main_function : str
        Name of the main function to be called. The function will be called with two parameters: 
        <div_id>, for example "#my_div", and <data_dict>.
    data_dict : dict
        Dictionary containing the data to be passed to <main_function>
    callbacks : dict
        Dictionary of the form {<callback_str_id> : <python_function>}. The javascript library can
        use callbacks to talk to python.
    css_list : list of str
        List of strings containing either 1) URL to a CSS stylesheet or 2) CSS styles
    """
    if callbacks is not None:
        print ("Warning: Python callbacks do not work in standalone HTML file.")
        print ("Saving file...")

    html_all = make_html(library_list, main_function, data_dict, css_list)
    with open(html_dest, "w") as f:
        f.write(html_all)

def execute_js(library_list, main_function, data_dict = {}, callbacks = {}, css_list=[]):
    """Executes a javascript function that can add content to an output div

    Parameters
    ----------
    library_list : list of str
        List of strings containing either 1) URL to a javascript library, 2) javascript code
    main_function : str
        Name of the main function to be called. The function will be called with two parameters: 
        <div_id>, for example "#my_div", and <data_dict>.
    data_dict : dict
        Dictionary containing the data to be passed to <main_function>
    callbacks : dict
        Dictionary of the form {<callback_str_id> : <python_function>}. The javascript library can
        use callbacks to talk to python.
    css_list : list of str
        List of strings containing either 1) URL to a CSS stylesheet or 2) CSS styles
    """
    html_all = make_html(library_list, main_function, data_dict, css_list)
    for callback_id in callbacks.keys():
        setup_comm_api(callback_id, callbacks[callback_id])
    display(HTML(html_all))
