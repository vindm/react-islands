import React from 'react';

import Control from '../Control';
import Button from '../Button';

class Checkbox extends Control {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            checked: props.checked,
        };

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onButtonFocusChange = this.onButtonFocusChange.bind(this);
        this.onButtonHoverChange = this.onButtonHoverChange.bind(this);
        this.onControlChange = this.onControlChange.bind(this);
    }

    /** @override */
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);

        // NOTE(narqo@): `setState({ checked })` must be called only if new `checked` value was passed
        // or `Checkbox` will stay in the `checked` state regardless the DOM events.
        if (this.props.checked !== nextProps.checked) {
            this.setState({
                ...this.state,
                checked: nextProps.checked,
            });
        }
    }

    //  При получении checked через props не менялось свойства checked у input'а.
    //  Или же нужно пропихнуть как-то checked (а не в defaultChecked) в render().
    //  Но тогда нужно будет пустой onChange повесить, видимо.
    componentDidUpdate(prevProps) {
        if (this.props.checked !== prevProps.checked) {
            this.refs.control.checked = this.props.checked;
        }
    }

    render() {
        const { name, theme, size, type, disabled, value } = this.props;
        const { checked, focused } = this.state;

        if (type === 'button') {
            //  В первом input'е нужно одновременно defaultValue и defaultChecked
            //  (а не просто value/checked). Иначе замучает warning'ами.
            //  Или же нужен фейковый onChange.
            return (
                <label className={this.className()}>
                    <Button theme={theme} size={size} type={type}
                        disabled={disabled}
                        checked={checked}
                        focused={focused}
                        onFocusChange={this.onButtonFocusChange}
                        onHoverChange={this.onButtonHoverChange}
                        onClick={this.onButtonClick}
                    >
                        {this.props.children}
                    </Button>
                    <input ref="control" className="checkbox__control" type="checkbox" autoComplete="off"
                        name={name}
                        disabled={disabled}
                        defaultValue={value}
                        defaultChecked={checked}
                    />
                </label>
            )
        } else {
            return (
                <label className={this.className()} {...this.getControlHandlers()}>
                    <span className="checkbox__box">
                        <input ref="control" className="checkbox__control" type="checkbox" autoComplete="off"
                            name={name}
                            disabled={disabled}
                            value={value}
                            checked={checked}
                            onChange={this.onControlChange}
                        />
                    </span>
                    <span className="checkbox__text" role="presentation">
                        {this.props.children}
                    </span>
                </label>
            )
        }
    }

    className() {
        var className = 'checkbox';

        const theme = this.props.theme || this.context.theme;
        if (theme) {
            className += ' checkbox_theme_' + theme;
        }
        if (this.props.size) {
            className += ' checkbox_size_' + this.props.size;
        }
        if (this.props.type) {
            className += ' checkbox_type_' + this.props.type;
        }
        if (this.props.disabled) {
            className += ' checkbox_disabled';
        }
        if (this.state.hovered) {
            className += ' checkbox_hovered';
        }
        if (this.state.focused) {
            className += ' checkbox_focused';
        }
        if (this.state.checked) {
            className += ' checkbox_checked';
        }

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        return className;
    }

    onButtonFocusChange(focused) {
        this.setState({ focused });
    }

    onButtonHoverChange(hovered) {
        this.setState({ hovered });
    }

    onButtonClick(e) {
        this.props.onClick(e, this.props);

        const checked = !this.state.checked;

        // FIXME(narqo@): `this.refs.control.checked = checked`
        this.refs.control.checked = checked;
        this.setState({ checked });

        this.props.onCheck(checked, this.props);
    }

    onControlChange() {
        const checked = !this.state.checked;
        this.setState({ checked });
        this.props.onCheck(checked, this.props);
    }
}

Checkbox.contextTypes = {
    theme: React.PropTypes.string,
};

Checkbox.defaultProps = {
    onClick() {},
    onCheck() {},
};

export default Checkbox;