module.exports = (robot) => {
  // Your code here
  robot.log('Yay, the app was loaded!')

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  robot.on('issues.opened', async context => {
    const params = context.issue({
      body: 'Issue opened hook received - Ready to work!\n'
    });

    const issueNumber = context.payload.issue.number;

    /**
     * If normalised issue title contains the word "Bug"
     * we'll have a look for the appropriate label and assign it
     */
    const issueTitle = context.payload.issue.title;
    if(issueTitle.toLowerCase().includes('bug')) {
      const bugLabel = await context.github.issues.getLabel({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: 'bug'
      });

      const applyBugLabel = context.github.issues.addLabels({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        number: issueNumber,
        labels: [bugLabel.data.name]
      });

      params.body = params.body + "\n Because your issue has the word 'bug' in it's title the bug label has been added. Please let us know if this is incorrect so we can make this check more accurate in future.";
    }

    return context.github.issues.createComment(params);
  });
}
