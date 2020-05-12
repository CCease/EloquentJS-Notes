/**
 * 2 Ways of creating Regular Expression
 * 
 * 1. let re1 = new RegExp("abc") == abc
 * 2. let re2 = /abc/;            == abc
 *     -special character need to add \ before it
 *     -eg: eighteenPlus == /eighteen\+/
 * 
 * 
 * ---------------------------------------------------
 * Set of Character 
 * /[0123456789]/ is equal to /[0-9]/ 
 * Both matches the strings that contain a digit.
 * 
 * --------
 * Examples
 * --------
 * console.log(/[0123456789]/.test("in 1992"));
 *  // → true
 *  console.log(/[0-9]/.test("in 1992"));
 *  // → true
 * ---------------------------------------------------
 * Common Character Groups
 * 
 * \d	Any digit character
 * \w	An alphanumeric character (“word character”)
 * \s	Any whitespace character (space, tab, newline, and similar)
 * \D	A character that is not a digit
 * \W	A nonalphanumeric character
 * \S	A nonwhitespace character
 * .	Any character except for newline
 * 
 * [\d.] means any digit or a period character. But the period itself, 
 * between square brackets, loses its special meaning. The same goes for
 * other special characters, such as +.
 * 
 * --------
 * Examples
 * --------
 * let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
 * console.log(dateTime.test("01-30-2003 15:20"));
 * // → true
 * console.log(dateTime.test("30-jan-2003 15:20"));
 * // → false
 * ----------------------------------------------------
 * Caret Sign ^ 
 * 
 * Match any character except the ones in the set.
 * 
 * --------
 * Examples
 * --------
 * let notBinary = /[^01]/;
 * console.log(notBinary.test("1100100010100110"));
 * // → false
 * console.log(notBinary.test("1100100010200110"));
 * // → true
 * ----------------------------------------------------
 * Plus Sign +
 * 
 * The expression will repeat
 * 
 * --------
 * Examples
 * --------
 * console.log(/'\d+'/.test("'123'"));
 * // → true
 * console.log(/'\d+'/.test("''"));
 * // → false
 * console.log(/'\d*'/.test("'123'"));
 * // → true
 * console.log(/'\d*'/.test("''"));
 * // → true
 * ----------------------------------------------------
 * Star Sign *
 * 
 * Same with plus but 0 matches is true.
 * 
 * --------
 * Examples
 * --------
 * let neighbor = /neighbou?r/;
 * console.log(neighbor.test("neighbour"));
 * // → true
 * console.log(neighbor.test("neighbor"));
 * // → true
 * -----------------------------------------------------
 * Braces {}
 * To express a patter repeat a precise amount of time
 * use braces. {}
 * {4}   means repeat exactly 4 times.
 * {2,4} means repeat at least twice and at most 4 times.
 * 
 * --------
 * Examples
 * -------
 * let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
 * console.log(dateTime.test("1-30-2003 8:45"));
 * // → true 
 * ------------------------------------------------------
 * Grouping Subexpressions using parentheses
 * 
 * --------
 * Example
 * --------
 * let cartoonCrying = /boo+(hoo+)+/i;
 * console.log(cartoonCrying.test("Boohoooohoohooo"));
 * // → true
 * ------------------------------------------------------
 * Exec, Matches and Group
 * 
 * Exec method will return null if no match is found.
 * Exec method will return an array of strings if matches are found.
 * Elements in array are arrange, bigger(oyter) first then smaller inner matches. 
 * 
 * --------
 * Examples
 * --------
 * console.log(/bad(ly)?/.exec("badly"));
 * // → ["bad", undefined]
 * console.log(/(\d)+/.exec("123"));
 * // → ["123", "3"]
 */