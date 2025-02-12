# Contributing to ACM AI's Wiki

Thank you for contributing to the ACM AI Wiki!

Here you will find resources on how to set up, navigate, and contribute to the Wiki.
### Setting Up
---

First, make sure you have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en) installed and then clone the repository. Make sure you `cd` into the `website` folder. Before running the website locally for the first time, run `npm i` to install the project's dependancies. Next, run `npm start` to start the website. If it doesn't start, try `npm run build` before starting again.
### File Structure
---

```
Year

└── Academic Quarter

    └── Workshop Series

        ├── Workshop 1

        │   ├── Figures

        │   │   ├── Workshop_Header_Dark.png

        │   │   └── Workshop_Header_light.png

        │   ├── README.md  (follow the directions in the file)

        │   └── workshopnotebook.ipynb  (required)

        ├── README.MD (follow the directions in the file)

        ├── Workshop_Main_Header_Dark.png

        └── Workshop_Main_Header_Light.png
```
### Making Changes
---

When contributing to the Wiki, make sure organize workshops by quarter and year. Add your Jupyter Notebook files. Utilize the workshop templates provided and follow the directions provided in the `README` files. Make a pull request when you're done!
### Adding a Workshop
---

Create a new folder with the format `year/term/name` similar to `2025/WI25/test`. Copy the single workshop or workshop series template into the folder. The `README` files will become visible pages, and placing the `.ipynb` workshop notebook file in the folder will display as a subpage.

Fill out the `README.md` template as directed by the comments. Feel free to make changes to the template if necessary.

Note: JSX style comments `{/*comment */}` instead of HTML-style comments `<!-- comment -->` are needed to deploy correctly.
### Creating a Pull Request
---

Creating a pull request starts a development preview build which you can check for accuracy. This should be located in a comment made by the Vercel bot where you can visit the preview. Merging the pull request will make the changes live on the wiki.
### Example Pull Request
---

You can view an example pull request [here](https://github.com/acmucsd/acm-ai-workshops/pull/38) and the corresponding deployment preview [here](https://acm-ai-workshops-git-example-acmucsd.vercel.app/). Note how this pull request created a preview build on Vercel and needs a review to be merged to main.
### Style Guide
---
Try to follow [Conventional Commits](https://www.conventionalcommits.org/) when making pull requests.