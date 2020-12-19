import React from 'react';
import PropTypes from 'prop-types';

// Make the VisualChart global available
export const { VisualChart } = window;

function invoke(fn, ...args) {
  return (typeof fn === 'function') ? fn(...args) : undefined;
}

// This is the lowest level wrapper of the VisualChart integration - it deals with loading of the
// VisualChart component, options, resizing and raising VisualChart events up

function createVisualChartComponent(type, onLoadFn) {
  class KlComponent extends React.Component {
    constructor(props) {
      super(props);
      VisualChart.promisify();
      this.type = type;
      this.onLoad = onLoadFn;
      // Bind our class specific functions to this
      // See: https://facebook.github.io/react/docs/react-without-es6.html#autobinding
      ['applyProps', 'setSelection', 'onEvent', 'onLoad'].forEach((prop) => {
        this[prop] = this[prop].bind(this);
      });
    }

    componentDidMount() {
      const componentDefinition = {
        container: this.klElement,
        type: this.type,
        options: this.props.options,
      };

      VisualChart.create(componentDefinition).then((component) => {
        this.component = component;
        this.component.on('all', this.onEvent);
        this.applyProps().then(() => {
          // Finally, tell the parent about the component so it can call functions on it
          invoke(this.props.ready, this.component, this.klElement);
        });
      });
    }

    componentWillUnmount() {
      // Clean up the component
      if (this.component) this.component.destroy();
    }

    setSelection() {
      // This works because the selectionchange event is not raised when changing selection
      // programmatically
      const selectedItems = this.component.selection(this.props.selection);
      if (this.type === 'chart' && selectedItems.length > 0) {
        this.component.zoom('selection', { animate: true, time: 250 });
      }
    }

    componentDidUpdate(prevProps) {
      if (this.component) {
        // we need to intercept the options being set and pass them on to the component manually
        if (this.props.options && this.props.options !== prevProps.options) {
          this.component.options(this.props.options); // don't worry about callback here
        }

        const reload = this.props.data !== prevProps.data;
        if (reload) {
          // note applyProps also deals with selection
          this.applyProps();
        } else if (this.props.selection || prevProps.selection) {
          if (this.props.selection !== prevProps.selection) {
            this.setSelection();
          }
        }
      }
    }

    // this looks for a handler with the right name on the props, and if it finds
    // one, it will call it with the event arguments.
    onEvent(props) {
      return invoke(this.props[props.name], props.event);
    }

    // this applies all the component related props except the options which are
    // handled differently
    applyProps() {
      return new Promise((resolve) => {
        this.component.load(this.props.data).then(() => {
          this.onLoad({ animate: !!this.props.animateOnLoad }).then(() => {
            this.component.selection(this.props.selection);
            resolve();
          });
        });
      });
    }

    render() {
      const { containerClassName, style, children } = this.props;
      return (
          <div ref={(klElement) => { this.klElement = klElement; }} className={containerClassName}
               style={style}>
            {children}
          </div>
      );
    }
  }

  // defaultProps has to be a static property of the component class
  KlComponent.defaultProps = {
    data: {},
    animateOnLoad: false,
    options: {},
    selection: [],
  };

  KlComponent.propTypes = {
    // data in the chart or time bar data format
    data: PropTypes.object,
    // specifies whether the layout on loading is animated
    animateOnLoad: PropTypes.bool,
    // chart or time bar options object
    options: PropTypes.object,
    // array of ids specifying the selected items
    selection: PropTypes.array,
    // called when the chart or time bar is fully loaded
    ready: PropTypes.func,
    // the style for the chart or time bar div
    style: PropTypes.object,
    // the CSS class name for the div containing the chart or time bar
    containerClassName: PropTypes.string,
    //  NOTE: you can add props at the level above this - e.g., 'click'
    //        i.e.,   <Chart click={this.clickHandler}/>
  };

  return KlComponent;
}

function createChartComponent() {
  function onLoad(options) {
    // default behaviour when loading data in the chart
    return this.component.layout('standard', options);
  }

  return createVisualChartComponent('chart', onLoad);
}

// Define the Chart component
export const Chart = createChartComponent();

function createTimebarComponent() {
  function onLoad(options) {
    // default behaviour when loading data in the timebar
    return this.component.zoom('fit', options);
  }

  return createVisualChartComponent('timebar', onLoad);
}

// Define the Timebar component
export const Timebar = createTimebarComponent();