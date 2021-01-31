import React, { Component } from 'react';

import Students from '../../components/students/Students';

class StudentsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Students />;
  }
}

export default StudentsContainer;
