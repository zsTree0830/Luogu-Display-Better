---
name: Feature request
about: Provide us with feedback on the new features you want
title: "[Feature] "
labels: enhancement
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
    - label: I have confirmed that the Luogu Display Better plugin is the latest version, and the latest version has not have this feature.
      required: true
    - label: I have searched and confirmed in [Issues](https://github.com/zsTree0830/Luogu-Display-Better/issues) that this feature has not yet been proposed.
      required: true
    - label: I am working on fixing this issue.
      required: false
- type: textarea
  id: description
  attributes:
    label: The desired feature
    desciption: The more detailed we are, the more we can achieve the functions you want
  validations:
    required: true
- type: textarea
  id: reason
  attributes:
    label: Reason
    description: Why you need this feature
  validations:
    required: false
