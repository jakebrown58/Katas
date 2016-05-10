# Node app for template fill-in.

## Usage:

`node splice [int:startIndex]`

## Requirements:

manu.txt -> the text manuscript.  format is:

  --------------------
  Entry Title
  --------------------

  Entry Body

  --------------------
  Entry 2 Title
  --------------------

  Enrty Body 2

templ.html -> the temlpate.

Looks for tags like

 **title**
 **text**
 **prev**
 **next**