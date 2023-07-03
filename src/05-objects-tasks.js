/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    getArea: () => width * height,
    width,
    height,
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(v) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BuildCSS {
  constructor() {
    this.tagname = {
      element: '',
      id: '',
      class: [],
      attr: [],
      pseudoClass: [],
      pseudoElement: '',
    };
  }

  static error(i = 1) {
    if (i) throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    else throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  verification(n) {
    return Object.values(this.tagname).slice(n).reduce((acc, el) => acc + !!el.length, 0);
  }

  element(v) {
    if (this.tagname.element) BuildCSS.error();
    if (this.verification(0)) BuildCSS.error(0);
    this.tagname.element = v;
    return this;
  }

  id(v) {
    if (this.tagname.id) BuildCSS.error();
    if (this.verification(1)) BuildCSS.error(0);
    this.tagname.id = v;
    return this;
  }

  class(v) {
    if (this.verification(3)) BuildCSS.error(0);
    this.tagname.class = [...this.tagname.class, v];
    return this;
  }

  attr(v) {
    if (this.verification(4)) BuildCSS.error(0);
    this.tagname.attr = [...this.tagname.attr, v];
    return this;
  }

  pseudoClass(v) {
    if (this.verification(5)) BuildCSS.error(0);
    this.tagname.pseudoClass = [...this.tagname.pseudoClass, v];
    return this;
  }

  pseudoElement(v) {
    if (this.tagname.pseudoElement) BuildCSS.error();
    this.tagname.pseudoElement = v;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.tagname.element = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    let sel = '';
    if (this.tagname.element) {
      sel += this.tagname.element;
    }
    if (this.tagname.id) {
      sel += `#${this.tagname.id}`;
    }
    if (this.tagname.class.length > 0) {
      sel += `.${this.tagname.class.join('.')}`;
    }
    if (this.tagname.attr.length > 0) {
      sel += `[${this.tagname.attr.join('][')}]`;
    }
    if (this.tagname.pseudoClass.length > 0) {
      sel += `:${this.tagname.pseudoClass.join(':')}`;
    }
    if (this.tagname.pseudoElement) {
      sel += `::${this.tagname.pseudoElement}`;
    }
    return sel;
  }
}

const cssSelectorBuilder = {
  element(v) {
    return new BuildCSS().element(v);
  },

  id(v) {
    return new BuildCSS().id(v);
  },

  class(v) {
    return new BuildCSS().class(v);
  },

  attr(v) {
    return new BuildCSS().attr(v);
  },

  pseudoClass(v) {
    return new BuildCSS().pseudoClass(v);
  },

  pseudoElement(v) {
    return new BuildCSS().pseudoElement(v);
  },

  combine(selector1, combinator, selector2) {
    return new BuildCSS().combine(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
