[![Stories in Ready](https://badge.waffle.io/unional/tslint-config-unional.png?label=ready&title=Ready)](https://waffle.io/unional/tslint-config-unional)
[![Build Status](https://travis-ci.org/unional/tslint-config-unional.svg?branch=master)](https://travis-ci.org/unional/tslint-config-unional)
# tslint-config-unional


A [`tslint`](https://github.com/palantir/tslint) extension package with several styles to choose from.

## Design Principles

There are several configurations available in this package.
Although they are different as they are designed for different programers,
here are the principles that they all follows:

- They are designed to be used by team
- Each team member can use their own IDE of choice
- The formatter available on each IDE should work with each configuration
- Code should look well and consistent on each IDE with folding
  - so that when you stop by your team member's cube, the code looks the same.
  - i.e., unfortunately, no [tab]
- Thrive for easy to write (with fewest keystrokes) while keeping the code clean

## Usage

```sh
# Install
npm install tslint-config-unional
```

```js
// tslint.json
{
  "extends": "tslint-config-unional" // or other styles
}
```

## About Supported IDE

Within this project, I use the term IDE and editor interchangably in this context.
The line between IDE and editor is burring by the day anyway.

I list the IDEs supported for specific style that I or some collaborators have verified.
If your IDE of choice is not listed, it doesn't necessary mean the style doesn't work on your IDE.

Feel free to try it out, and let me know if it works for you or not so that I can update the list accordingly.
Also, the best thing to do and file issues on your IDE so that you can use the style that you like.

## Styles

- [Default](style-default.md)
- [Strict](style-strict.md)
- [Standard](style-standard.md) (based off of [`tslint-config-standard`](https://github.com/blakeembrey/tslint-config-standard))
- [Semi Standard](style-semi-standard.md)

## LICENSE

MIT
