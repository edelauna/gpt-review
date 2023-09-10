[![Build and Test](https://github.com/actions/checkout/actions/workflows/test.yml/badge.svg)](https://github.com/actions/checkout/actions/workflows/test.yml)

# Chat GPT Code Peer Review v1

This GitHub Action enables automatic code reviewing in your repository by sending the git diff patches between a head ref and a base ref to OpenAI's API for annotation using Chat GPT. By leveraging the power of natural language processing, it enhances collaboration and automates the review process similar to static code analysis tools. The annotations provided by Chat GPT serve as non-invasive automated reviews, helping to identify potential issues and improve overall code quality.

# Usage

<!-- start usage -->
```yaml
- uses: actions/checkout@v4
- name: Chat GPT Code Peer Review
  uses: edelauna/gpt-review@v1
  with:
    # OpenAI API key used for sending patch diffs for review.
    # Required
    openai_api_key: ''

    # The target branch for the git diff to run against.
    # Default: ${{ github.base_ref }}
    target_branch: ''

    # List of comma seperated values for files to ignore as part of the review process.
    ignore_files: ''
```
<!-- end usage -->
* [Example Usage Implementation](https://github.com/edelauna/discord-bot-ai/actions/runs/6128445766/workflow?pr=74#L10).


Goto `files` sections of the PR to see annotations, an [example of a PR with annotations](https://github.com/edelauna/discord-bot-ai/pull/74/files):

![Screenshot 2023-09-06 165310](https://github.com/edelauna/gpt-review/assets/54631123/e37c4a7b-0172-461e-b016-347d7e0f3ccf)

![Screenshot 2023-09-06 171602](https://github.com/edelauna/gpt-review/assets/54631123/f9fd6771-5f1d-423c-8abb-ff56c9917888)

> [!NOTE]
>
> If there are no annotations, you can verify by checking the CI job logs to see if any `Notices` have been posted.
>
> For example [see logs of annotation here](https://github.com/edelauna/discord-bot-ai/actions/runs/6128445766/job/16635484534?pr=74#step:3:570).

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)


# Limitations
Github Actions Limits Annotations to 10.

# Dependencies
* `[@actions/core](https://github.com/actions/toolkit/tree/main/packages/core)`
* `[@actions/exec](https://github.com/actions/toolkit/tree/main/packages/exec)`
* `[gpt-3-encoder](https://github.com/latitudegames/GPT-3-Encoder#readme)`
* `[openai](https://github.com/openai/openai-node#readme)`
