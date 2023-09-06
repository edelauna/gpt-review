[![Build and Test](https://github.com/actions/checkout/actions/workflows/test.yml/badge.svg)](https://github.com/actions/checkout/actions/workflows/test.yml)

# Checkout V0.1

This GitHub Action enables automatic code reviewing in your repository by sending the git diff patches between a head ref and a base ref to OpenAI's API for annotation using Chat GPT. By leveraging the power of natural language processing, it enhances collaboration and automates the review process similar to static code analysis tools. The annotations provided by Chat GPT serve as non-invasive automated reviews, helping to identify potential issues and improve overall code quality.

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

![Screenshot 2023-09-06 165310](https://github.com/edelauna/gpt-review/assets/54631123/e37c4a7b-0172-461e-b016-347d7e0f3ccf)

![Screenshot 2023-09-06 171602](https://github.com/edelauna/gpt-review/assets/54631123/f9fd6771-5f1d-423c-8abb-ff56c9917888)

> [!NOTE]
> 
> If there are no annotations, you can verify by checking the CI job logs to see if any `Notices` have been posted.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)


# Limitations
Github Actions Limits Annotations to 10.

[Regular Chat GPT Hallucination](https://github.com/edelauna/gpt-review/pull/7/files#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R7):

![Screenshot 2023-09-06 172118](https://github.com/edelauna/gpt-review/assets/54631123/a972a0c9-d18d-4a7c-9c69-1f6f7f25da2b)

<sub>Chat GPT providing a recommendation to declare `diff` using `const` instead of `let`, when in fact it is already declared using `const`.</sub>
