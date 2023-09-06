[![Build and Test](https://github.com/actions/checkout/actions/workflows/test.yml/badge.svg)](https://github.com/actions/checkout/actions/workflows/test.yml)

# Checkout V0.1

This GitHub Action sends the git diff patches between a head ref and a base ref to OpenAI's API for annotating PRs with reviews performed by Chat GPT. It can be used to automate the review process and enhance collaboration in your repository.

# Usage

<!-- start usage -->
```yaml
- uses: actions/checkout@v4
- uses: edelauna/gpt-review@v0.1
  with:
    # OpenAI API key used for sending patch diffs for review.
    # Required
    openai_api_key: ''

    # The target branch for the git diff to run against.
    # Default: ${{ github.base_ref }}
    target_branch: ''
```
<!-- end usage -->

Goto `files` sections of the PR to see annotations, along the lines of:

> **Note**
> Can check job itself to see if there were any `Notices` posted.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)


# Limitations
Github Actions Limits Annotations to 10.

Regular Chat GPT Hallucination:
https://github.com/edelauna/gpt-review/pull/7/files#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R7

