from IPython.core.display import display, HTML, Javascript
from IPython import get_ipython


def setup_comm_colab(api_call_id, callback):
    """Function that connects javascript call with a Colab Notebook"""
    from google.colab import output
    from IPython import display
    def _recv(msg):
        return display.JSON(callback(msg)) # Use display.JSON to transfer an object
    output.register_callback(api_call_id, _recv)

def setup_comm_jupyter(api_call_id, callback): 
    """Function that connects javascript call with a Jupyter Notebook"""
    def _comm_api(comm, open_msg): 
        @comm.on_msg
        def _recv(msg):
            ret = callback(msg['content']['data'])
            comm.send(ret)
    get_ipython().kernel.comm_manager.register_target(api_call_id, _comm_api)

def setup_comm_api(api_call_id, callback):
    """Function that abstracts notebook connection (Jupyter or Colab) to javascript"""
    try:
        jupyter_setup = True
        setup_comm_jupyter(api_call_id, callback)
    except Exception:
        jupyter_setup = False
    try:
        colab_setup = True
        setup_comm_colab(api_call_id, callback)
    except Exception:
        colab_setup = False
    if not jupyter_setup and not colab_setup:
        print("Error: Cannot find Jupyter/Colab namespace for Python")