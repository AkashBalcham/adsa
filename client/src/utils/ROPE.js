/**
 * @param {String} str - String to populate the rope.
 * @api public
 */

function Rope(str) {                    // Creates a rope data structure
    // allow usage without `new`
    if (!(this instanceof Rope)) return new Rope(str);
  
    this._value = str;
    this.length = str.length;
    adjust.call(this);
  }
  
  /**
   * The threshold used to split a leaf node into two child nodes.
   *
   * @api public
   */
  
  Rope.SPLIT_LENGTH = 1000;
  
  /**
   * The threshold used to join two child nodes into one leaf node.
   *
   * @api public
   */
  
  Rope.JOIN_LENGTH = 500;
  
  /**
   * The threshold used to trigger a tree node rebuild when rebalancing the rope.
   *
   * @api public
   */
  
  Rope.REBALANCE_RATIO = 1.2;
  
  /**
   * @api private
   */
  
  function adjust() {                             // Rebalances the tree such the text is evenly split
    if (typeof this._value != 'undefined') {
      if (this.length > Rope.SPLIT_LENGTH) {
        var divide = Math.floor(this.length / 2);
        this._left = new Rope(this._value.substring(0, divide));
        this._right = new Rope(this._value.substring(divide));
        delete this._value;
      }
    } else {
      if (this.length < Rope.JOIN_LENGTH) {
        this._value = this._left.toString() + this._right.toString();
        delete this._left;
        delete this._right;
      }
    }
  }
  
  /**
   * *
   * @api public
   */
  
  Rope.prototype.toString = function() {        // Gives the entire string held by the rope
    if (typeof this._value != 'undefined') {
      return this._value;
    } else {
      return this._left.toString() + this._right.toString();
    }
  }
  
  /**.
   *
   * @param {Number} start - Initial position (inclusive)
   * @param {Number} end - Final position (not-inclusive)
   * @api public
   */
  
  Rope.prototype.remove = function(start, end) {      // sub string in the range [start, end) is removed
    if (start < 0 || start > this.length) alert('Start is not within rope bounds.');
    if (end < 0 || end > this.length) alert('End is not within rope bounds.');
    if (start > end) alert('Start is greater than end.');
    if (typeof this._value != 'undefined') {
      this._value = this._value.substring(0, start) + this._value.substring(end);
      this.length = this._value.length;
    } else {
      var leftLength = this._left.length;
      var leftStart = Math.min(start, leftLength);
      var leftEnd = Math.min(end, leftLength);
      var rightLength = this._right.length;
      var rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
      var rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));
      if (leftStart < leftLength) {
        this._left.remove(leftStart, leftEnd);
      }
      if (rightEnd > 0) {
        this._right.remove(rightStart, rightEnd);
      }
      this.length = this._left.length + this._right.length;
    }
    adjust.call(this);
  }
  
  /**
   *
   * @param {Number} position - Where to insert the text
   * @param {String} value - Text to be inserted on the rope
   * @api public
   */
  
  Rope.prototype.insert = function(position, value) {       // Inserts the string at the given position
    if (typeof value != 'string') {
      value = value.toString();
    }
    // if (position < 0 || position > this.length) throw new RangeError('position is not within rope bounds.');
    if (position < 0 || position > this.length) alert('Position is not within rope bounds.');

    if (typeof this._value != 'undefined') {
      this._value = this._value.substring(0, position) + value.toString() + this._value.substring(position);
      this.length = this._value.length;
    } else {
      var leftLength = this._left.length;
      if (position < leftLength) {
        this._left.insert(position, value);
        this.length = this._left.length + this._right.length;
      } else {
        this._right.insert(position - leftLength, value);
      }
    }
    adjust.call(this);
  }
  
  /**
   *
   * @api public
   */
  
  Rope.prototype.rebuild = function() {         // Re-builds a balanced Rope with the current text
    if (typeof this._value == 'undefined') {
      this._value = this._left.toString() + this._right.toString();
      delete this._left;
      delete this._right;
      adjust.call(this);
    }
  }
  
  /**
   *
   * @api public
   */
  
  Rope.prototype.rebalance = function() {     // Finds unbalanced nodes and rebuilds those subtrees
    if (typeof this._value == 'undefined') {
      if (this._left.length / this._right.length > Rope.REBALANCE_RATIO ||
          this._right.length / this._left.length > Rope.REBALANCE_RATIO) {
        this.rebuild();
      } else {
        this._left.rebalance();
        this._right.rebalance();
      }
    }
  }
  
  /**
   * Returns text from the rope between the `start` and `end` positions.
   * The character at `start` gets returned, but the character at `end` is 
   * not returned.
   *
   * @param {Number} start - Initial position (inclusive)
   * @param {Number} end - Final position (not-inclusive)
   * @api public
   */
  
  Rope.prototype.substring = function(start, end) {     // gives the substring in the range [start, end)
    if (typeof end == 'undefined') {
      end = this.length;
    }
    if (start < 0 || isNaN(start)) {
      start = 0;
    } else if (start > this.length) {
      start = this.length;
    }
    if (end < 0 || isNaN(end)) {
      end = 0;
    } else if (end > this.length) {
      end = this.length;
    }
    if (typeof this._value != 'undefined') {
      return this._value.substring(start, end);
    } else {
      var leftLength = this._left.length;
      var leftStart = Math.min(start, leftLength);
      var leftEnd = Math.min(end, leftLength);
      var rightLength = this._right.length;
      var rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
      var rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));
  
      if (leftStart !== leftEnd) {
        if (rightStart !== rightEnd) {
          return this._left.substring(leftStart, leftEnd) + this._right.substring(rightStart, rightEnd);
        } else {
          return this._left.substring(leftStart, leftEnd);
        }
      } else {
        if (rightStart !== rightEnd) {      
          return this._right.substring(rightStart, rightEnd);
        } else {
          return '';
        }
      }
    }
  }
  
  /**
   * Returns a string of `length` characters from the rope, starting
   * at the `start` position.
   *
   * @param {Number} start - Initial position (inclusive)
   * @param {Number} length - Size of the string to return
   * @api public
   */
  
  Rope.prototype.substr = function(start, length) {
    var end;
    if (start < 0) {
      start = this.length + start;
      if (start < 0) {
        start = 0;
      }
    }
    if (typeof length == 'undefined') {
      end = this.length;
    } else {
      if (length < 0) {
        length = 0;
      }
      end = start + length;
    }
    return this.substring(start, end);
  }
  
  /**
   * Returns the character at `position`
   *
   * @param {Number} position
   * @api public
   */
  
  Rope.prototype.charAt = function(position) {          // Returns the character at a given position
    return this.substring(position, position + 1);
  }
  
  /**
   * Returns the code of the character at `position`
   *
   * @param {Number} position
   * @api public
   */

  Rope.prototype.charCodeAt = function(position) {        // Gives assci code of the character at that index
    return this.substring(position, position + 1).charCodeAt(0);
  }
  
  module.exports = Rope;


  /*
  ## Algorithms for Rope Functions:

**1. insert(position, value)**

This function inserts a string (`value`) at a specific position (`position`) within the Rope.

**Steps:**

1. **Input Validation:**
    - Check if `value` is a string. If not, convert it to a string using `toString()`.
    - Check if `position` is within valid bounds (0 to `this.length`). If not, throw an error (or use alert as shown in the code).

2. **Leaf Node (with stored value):**
    - If `this._value` exists (leaf node), update the stored value by performing a substring operation to insert the new value at the desired position:
        ```
        this._value = this._value.substring(0, position) + value + this._value.substring(position);
        ```
    - Update the `length` property of the node to reflect the new string length.

3. **Composite Node (with child nodes):**
    - Determine if the insertion point falls within the left or right subtree based on `position` and the length of the left subtree (`_left.length`).
    - If `position` is less than the left subtree length, recursively call `insert` on the left child node (`this._left`) with the same `position`.
    - Otherwise, call `insert` on the right child node (`this._right`) with the adjusted position (`position - leftLength`).

4. **Rebalancing:**
    - After insertion, call `adjust.call(this)` to ensure the tree remains balanced by potentially splitting or joining subtrees based on the `Rope.SPLIT_LENGTH` and `Rope.JOIN_LENGTH` constants.

**2. remove(start, end)**

This function removes a substring from the Rope within a specified range (`start` to `end`, exclusive).

**Steps:**

1. **Input Validation:**
    - Check if `start` and `end` are within valid bounds (0 to `this.length`). If not, throw an error (or use alert as shown in the code).
    - Ensure `start` is less than `end` (otherwise, no characters to remove).

2. **Leaf Node (with stored value):**
    - If `this._value` exists (leaf node), perform a substring operation to remove the characters between `start` and `end`:
        ```
        this._value = this._value.substring(0, start) + this._value.substring(end);
        ```
    - Update the `length` property of the node to reflect the new string length.

3. **Composite Node (with child nodes):**
    - Determine the lengths of both subtrees (`leftLength` and `rightLength`).
    - Calculate adjusted start and end positions for potential operations on left and right subtrees:
        - `leftStart` = minimum of `start` and `leftLength`
        - `leftEnd` = minimum of `end` and `leftLength`
        - `rightStart` = maximum of 0 and minimum (`start - leftLength`, `rightLength`)
        - `rightEnd` = maximum of 0 and minimum (`end - leftLength`, `rightLength`)
    - If `leftStart` is less than `leftLength` (characters to remove from left subtree):
        - Recursively call `remove` on the left child node (`this._left`) with adjusted positions (`leftStart`, `leftEnd`).
    - If `rightEnd` is greater than 0 (characters to remove from right subtree):
        - Recursively call `remove` on the right child node (`this._right`) with adjusted positions (`rightStart`, `rightEnd`).
    - Update the overall `length` of the node by summing the lengths of the left and right subtrees.

4. **Rebalancing:**
    - After removal, call `adjust.call(this)` to ensure the tree remains balanced by potentially splitting or joining subtrees based on the `Rope.SPLIT_LENGTH` and `Rope.JOIN_LENGTH` constants.

**3. substring(start, end)**

This function retrieves a substring from the Rope within a specified range (`start` to `end`, exclusive).

**Steps:**

1. **Input Validation:**
    - Set a default value for `end` if not provided (use `this.length`).
    - Handle negative or out-of-bounds values for `start` and `end`.

2. **Leaf Node (with stored value):**
    - If `this._value` exists (leaf node), perform a substring operation to extract the desired range:
        ```
        return this._value.substring(start, end);
        ```

3. **
  
  */