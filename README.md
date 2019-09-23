# webQAProject 

To setup the project: 
Clone the repository on your machine.

To work on a task: 
Create a new branch with the name of the task you are working on: 

git checkout -b __name of your branch__ 

This creates a new local branch on your machine. 

When you are ready with your tasks create a pull request the following way: 

1. Go to pull requests.
2. Click "New pull request" button.
3. Choose master as base and your branch as compare. 
4. Click on Create 

If you cant see your branch then it is not tracked by the remote so you would need to do the following command,

git push --set-upstream origin __name of your branch__

then create the pull request.
