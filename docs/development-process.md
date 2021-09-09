## Development Process Guidelines
### Introduction

These notes are intended for an entry level developer who wishes to contribute to the ashteki code base.

### Tools

You will need a github account, from which you can fork the code from the main repository. Branch the code in your repository to a development/feature branch so that your main branch can keep up with the main repository's updates and you can develop your features separately.

VSCode installed on your computer is a useful tool for viewing the code base. With the appropriate feature branch selected, you can make edits to files, and then save them. 

### Debugging

VSCode allows you to set breakpoints within the code and inspect the data elements that are available at that point.

### Functional Testing

Running 
```
npm test
```
from the repository root directory in a terminal prompt on your computer, or from inside VScode terminal will perform functional tests. 

If you are running ashteki using a Docker container, stopping and starting Docker will allow you to confirm user functionality further by running a test game. Changes to .js or config files should only require Docker to start and stop. Some changes may require a rebuild from your local repository before the Docker container will update them:
```
docker-compose build
```
After rebuilding, you will need to open separate terminals, navigate to the repository and run the following commands:
```
docker-compose exec lobby node server/scripts/ashes/importdata
docker-compose exec lobby node server/scripts/ashes/importprecons
```
These commands import card data, and precons respectively. They can be run from the command line at any time to delete and recreate the data.

### Committing Changes and Pull Requests

Once you are happy with your changes, commit them in VSCode. If the commit fixes a particular bug (e.g. #123) in the main repository, write 'fixes #123' (or fix, fixed, resolves or close) in your commit message then when  merge the pull request GitHub will link and close the issue that you are talking about. Synch to your Github repository, and from Github you can navigate to the main repository and make a Pull Request to have your changes incorporated into the main code base. Don't make new commits on that branch until the pull request has been resolved as your pull request will update automatically with the commits.

### JavaScript Notes

In JavaScript, context is the equivalent of self to reference the object.
Sometime during testing of a new card, creating a separate method that is called from the problematic section of the method that you are building (e.g. Copycat) will allow you to set a breakpoint to inspect the data available at that point in the code. Another method of resolving problematic code is to specify the functional tests so that you can rapidly test code changes to see if they reduce the number of issues. 