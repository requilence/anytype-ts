import React, { Component } from 'react';

class DataView extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      activeFilter: null,
      activeSorting: null,
      filterValue: null,
      sortingValue: null,
    };
  }

  handleFilterChange(event) {
    const filter = event.target.value;
    this.setState({ activeFilter: filter, filterValue: filter });
  }
  
  handleSortingChange(event) {
    const sorting = event.target.value;
    this.setState({ activeSorting: sorting, sortingValue: sorting });
  }

  render() {
    const { activeFilter, activeSorting, filterValue, sortingValue } = this.state;
  
    return (
      <div>
        <div>Active Filter: {activeFilter}</div>
        <div>Active Sorting: {activeSorting}</div>
        <div>
          <select value={filterValue} onChange={this.handleFilterChange.bind(this)}>
            {/* Filter options go here */}
          </select>
        </div>
        <div>
          <select value={sortingValue} onChange={this.handleSortingChange.bind(this)}>
            {/* Sorting options go here */}
          </select>
        </div>
        {/* Rest of the component's rendering logic */}
      </div>
    );
  }
}

export default DataView;
