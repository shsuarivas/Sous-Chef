# Documentation
The diagrams for our project. Simple flowcharts should be made using [mermaid](https://mermaid.js.org/intro/) so they can be embedded in markdown and don't need an extra program to view or edit. More complicated diagrams like UI mockups can probably be made in [draw.io](https://draw.io).

## Project structure
```mermaid
flowchart LR
    subgraph frontend["Frontend"]
    website["Website UI"]
    vite["Vite"]
    vite-- "HTML <br> CSS <br> JS (React)" -->website
    end

    subgraph backend["Backend"]
    nodejs["NodeJS"]
    sql[("PostgreSQL")]

    nodejs-- "User account queries <br> Recipe queries" -->sql
    sql-- "User info <br> Recipe info" -->nodejs
    end

    subgraph cloud["Google Cloud"]
    texttospeech["Text-to-Speech API"]
    speechtotext["Speech-to-Text API"]
    end

    %% Outside links
    website-- "Login attempts <br> Recipe searches <br> Microphone input" -->nodejs
    nodejs-- "Account info <br> Recipe info <br> Assistant audio files" -->website

    nodejs-- "Assistant voice lines (as text)" ---->texttospeech
    texttospeech-- "Audio files" ---->nodejs
    nodejs-- "User microphone recording" ---->speechtotext
    speechtotext-- "User's spoken words" ---->nodejs
```
The frontend is written in HTML, CSS, and JavaScript (using [React](https://react.dev)). The site is served using [Vite](https://vite.dev). The website makes HTTPS requests to the backend for things like login attempts and searching for recipes. Microphone input and assistant audio should probably be sent using WebRTC, which will need a WebSocket connection to open.

The backend is written in NodeJS. It communicates with the Google Voice API to transcribe microphone input from the user and also generate assistant voice responses. The backend also communicates with the SQL server to authenticate users and retrieve recipe information.

## UI Flow

```mermaid
flowchart LR
    start(["Start"])
    homepage["Home Page"]
    recipe_overview["Recipe Overview"]
    cooking_ui["Cooking UI"]

    start-->homepage
    homepage-- "Recipe selected" -->recipe_overview
    recipe_overview-- "Start recipe" -->cooking_ui
    cooking_ui-- "Finished cooking" -->homepage
```
Typical flow for selecting a recipe and cooking it (assuming the user is logged in).

## UI Content
```mermaid
flowchart LR
    subgraph homepage["Home Page"]
        subgraph titlebar["Title Bar"]
            search_bar(["Search bar"])
            login(["Log in"])
            signup(["Sign up"])
        end

        subgraph recipe_list["Recipe List"]
            subgraph recipe_n["`Recipe *n*`"]
                recipe_name(["Name"])
                recipe_picture(["Picture"])
            end
        end
    end
```

```mermaid
flowchart LR
    subgraph recipe_overview["Recipe Overview"]
        subgraph recipe_info["Recipe Info"]
            overview_picture(["Picture"])
            overview_name(["Name"])
            overview_difficulty(["Difficulty"])
            overview_cooking_time(["Cooking time"])
        end
        subgraph recipe_ui["Buttons"]
            start(["Start recipe"])
            save(["Save recipe"])
            back(["Back"])
        end
        subgraph ingredients_list["Ingredients list"]
            subgraph ingredient["`Ingredient *n*`"]
                ingredient_name(["Name"])
                ingredient_quantity(["Quantity"])
            end
        end
        subgraph cooking_instructions["Cooking instructions"]
            subgraph step["`Step *n*`"]
                step_number(["Step number"])
                step_description(["Step description"])
            end
        end
    end
```

```mermaid
flowchart LR
    subgraph cooking_ui["Cooking UI"]
        subgraph info["Info"]
            time_remaining(["Time remaining"])
        end
        subgraph buttons["Buttons"]
            next(["Next step"])
            previous(["Previous step"])
            exit(["Exit"])
        end
        subgraph step["Current step"]
            step_number(["Step number"])
            step_description(["Step description"])
        end
    end
```
Idea: Maybe the cooking UI should still show all steps, but the current step is highlighted and centered.