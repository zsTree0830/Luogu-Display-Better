---
name: Bug report
about: Report bugs to us to improve your experience
title: "[Bug] "
labels: bug
assignees: UTF-8s, zsTree0830

---

- type: markdown
  attributes:
    value: Welcome to submit new Issues for the Luogu Display Better plugin! Please fill out the following form:
- type: checkboxes
  id: confirm
  attributes:
    label: Checklist
    options:
    - label: I have confirmed that the Luogu Display Better plugin is the latest version, and the latest version has not fixed this bug.
      required: true
    - label: I have searched in [Issues](https://github.com/zsTree0830/Luogu-Display-Better/issues) and confirmed that this bug has not been reported.
      required: true
    - label: I am working on fixing this issue.
      required: false
- type: textarea
  id: problem
  attributes:
    label: The specific manifestation of the bug
    description: Including screenshots can more clearly articulate your issue
  validations:
    required: true
- type: textarea
  id: reproduce
  attributes:
    label: Reproduction steps
  validations:
    required: false
- type: textarea
  id: console
  attributes:
    label: Console error message
  validations:
    required: false
