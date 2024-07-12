# Charlie Hart - Neuphonic Challenge Solution

## Installing packages

First navigate to the project directory.

### Create a virtual environment:

Create a virtual environment to store the required packages:

```python -m venv .venv```

### Activate the virtual environment:

#### Linux/MacOS

```source .venv/bin/activate```

#### Windows CommandPrompt

```.\.venv\Scripts\activate.bat```

#### Windows PowerShell

```.\.venv\Scripts\activate.ps1```

### Install from requirements.txt

To install all the required packages in the virtual environment, run the following:

```pip install -r requirements.txt```

## Running the server

When in the project directory, run the following:

```fastapi run main.py```

## Running a client instance

With the server running, navigate to http://localhost:8000/static/index.html
