# javascript-interpreter-example

Javascript Interpreter Example Code

This is an implementation of an language in pure javascript purpose of this repository is to demonstrate how such an interpreter can be built.

# Chapter 1

## Building a lexer

We will start our journey by building a lexer. Lexer is a piece of software which reads characters and transforms them into tokens. We will then use those tokens in the next stage.

You might think "ok this is easy, we will just use some regex to find things in the code string we want and produce tokens". This is not a good approach as you need to be able to also detect the correct positions of the token and without a really complicated regex that might not be possible and can lead to bugs.

That is not to say that we won't use regex at all, we will use it but on a character level to detect a specific range of characters like uppercase / lowercase letters and numbers.

Our first order of business is to read characters one by one. We will need to read characters and store state where we are so that lexer can check for some characters ahead or before to make decisions whether it can detect a specific token or not.