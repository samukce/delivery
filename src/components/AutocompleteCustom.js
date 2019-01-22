import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import constants from './constants';
import idgen from './idgen';
import { Icon } from 'react-materialize';

class AutocompleteCustom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      itemSelected: false,
      activeItem: 0,
      expandItems: false
    };

    this.renderIcon = this.renderIcon.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  componentWillReceiveProps({ value, itemSelected }) {
    if (value !== undefined) {
      this.setState({ value });
    }
    if (itemSelected !== undefined) {
      this.setState({ itemSelected });
    }
  }

  renderIcon(icon, iconClassName) {
    return <Icon className={iconClassName}>{icon}</Icon>;
  }

  renderDropdown(data, minLength, limit) {
    const { value, itemSelected, activeItem, expandItems } = this.state;

    if ((minLength && minLength > value.length)
       || (!expandItems && !value)
       || itemSelected) {
      return null;
    }

    let matches;
    if (expandItems)
      matches = this._allValue();
  else
      matches = this._findRealValue(value);

    if (limit) matches = matches.slice(0, limit);
    if (matches.length === 0) {
      return null;
    }

    return (
      <ul
        className="autocomplete-content dropdown-content"
        ref={autoCompleteContent =>
          (this.autoCompleteContent = autoCompleteContent)
        }
      >
        {matches.map((key, idx) => {
          const index = key.toUpperCase().indexOf(value.toUpperCase());
          return (
            <li
              key={key + '_' + idx}
              onClick={this._onAutocomplete.bind(this, key, data[key])}
              className={idx === activeItem ? 'active' : null}
            >
              {data[key] && data[key].img ? (
                <img src={data[key].img} className="right circle" alt="" />
              ) : null}
              <span>
                {index !== 0 ? key.substring(0, index) : ''}
                <span className="highlight">{value}</span>
                {key.length !== index + value.length
                  ? key.substring(index + value.length)
                  : ''}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  _onChange(evt) {
    const { onChange, expandOnFocus } = this.props;
    const value = evt.target.value;
    if (onChange) {
      onChange(evt, value);
    }

    let expandItems = expandOnFocus && value === '';

    this.setState({ value, itemSelected: false, activeItem: 0, expandItems });
  }

  _onKeyDown(evt) {
    const { activeItem } = this.state;
    const matches = this.autoCompleteContent
      ? this.autoCompleteContent.childNodes
      : null;
    let matchCount = 0;

    if (
      this.autoCompleteContent !== null &&
      this.autoCompleteContent !== undefined
    ) {
      matchCount = matches.length - 1; // -1 for start index from 0.
    }

    // if event is arrow down
    if (evt.keyCode === 40) {
      evt.preventDefault();
      if (matchCount > activeItem) {
        this.setState({
          activeItem: activeItem + 1
        });
      }
    }

    // if event is arrow up
    if (evt.keyCode === 38) {
      evt.preventDefault();
      if (activeItem > 0) {
        this.setState({
          activeItem: activeItem - 1
        });
      }
    }

    // if event is esc, reset value.
    if (evt.keyCode === 27) {
      this.setState({ value: '' });
    }

    // if event is enter
    if (evt.keyCode === 13) {
      evt.preventDefault();
      // liValue is gets text content of item that pressed enter.
      // we can't do innerHTML or innerText because there is <span className="highlight"></span>
      const matcheActive = matches ? matches[activeItem] : null;
      if (!matcheActive) return;

      matcheActive.click();
    }
  }

  _onFocus(evt) {
    const { expandOnFocus } = this.props;
    if (!expandOnFocus) return;

    this.setState({ expandItems: true });
  }

  _onBlur(evt) {
    const { expandOnFocus } = this.props;
    if (!expandOnFocus) return;

    setTimeout(() => {
      this.setState({ expandItems: false });
    }, 100);
  }

  _findRealValue(liValue) {
    const { data } = this.props;

    // go and look to data. if you find a key that have same name with value, return it.
    return Object.keys(data).filter(key => {
      const index = key.toUpperCase().indexOf(liValue.toUpperCase());
      return index !== -1 && liValue.length <= key.length;
    });
  }

  _allValue = () => Object.keys(this.props.data);

  _onAutocomplete(value, object, evt) {
    const { onChange, onAutocomplete } = this.props;
    if (onAutocomplete) {
      onAutocomplete(object ? object: value);
    }
    if (onChange) {
      onChange(evt, value);
    }

    this.setState({ value, itemSelected: true, expandItems: false });
  }

  render() {
    const {
      id,
      className,
      title,
      data,
      icon,
      iconClassName,
      s,
      m,
      l,
      offset,
      minLength,
      placeholder,
      limit,
      expandOnFocus,
      // these are mentioned here only to prevent from getting into ...props
      value,
      onChange,
      onAutocomplete,
      ...props
    } = this.props;

    const _id = id || `autocomplete-${idgen()}`;
    const sizes = { s, m, l };
    let classes = {
      col: true
    };
    constants.SIZES.forEach(size => {
      classes[size + sizes[size]] = sizes[size];
    });

    
    return (
      <div
        offset={offset}
        className={cx('input-field', className, classes)}
        {...props}
      >
        {icon && this.renderIcon(icon, iconClassName)}
        <input
          placeholder={placeholder}
          className="autocomplete"
          id={_id}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          onFocus={expandOnFocus && this._onFocus}
          onBlur={expandOnFocus && this._onBlur}
          type="text"
          value={this.state.value}
        />
        <label htmlFor={_id}>{title}</label>
        {this.renderDropdown(data, minLength, limit)}
      </div>
    );
  }
}

AutocompleteCustom.propTypes = {
  /**
   * Uniquely identifies <input> generated by this component
   * Used by corresponding <label> for attribute
   */
  id: PropTypes.string,
  className: PropTypes.string,
  /*
   * The title of the autocomplete component.
   */
  title: PropTypes.string,
  /*
   * An object with the keys of the items to match in autocomplete
   * The values are either null or a location to an image
   */
  data: PropTypes.object.isRequired,
  /*
   * Optional materialize icon to add to the autocomplete bar
   */
  icon: PropTypes.string,
  iconClassName: PropTypes.string,
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  offset: PropTypes.string,
  /*
   * Determine input length before dropdown
   */
  minLength: PropTypes.number,
  /**
   * The max amount of results that can be shown at once. Default: Infinity
   * */
  limit: PropTypes.number,
  /**
   * Placeholder for input element
   * */
  placeholder: PropTypes.string,
  /**
   * Called when the value of the input gets changed - by user typing or clicking on an auto-complete item.
   * Function signature: (event, value) => ()
   */
  onChange: PropTypes.func,
  /**
   * Called when auto-completed item is selected.
   * Function signature: (value) => ()
   */
  onAutocomplete: PropTypes.func,
  /**
   * The value of the input
   */
  value: PropTypes.string
};

export default AutocompleteCustom;
