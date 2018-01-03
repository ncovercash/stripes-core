import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { connect as reduxConnect } from 'react-redux'; // eslint-disable-line

import { requestLogin, requestSSOLogin } from '../../loginServices';
import Login from './Login';

class LoginCtrl extends Component {
  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    authFailure: PropTypes.string,
    ssoEnabled: PropTypes.bool,
    autoLogin: PropTypes.shape({
      username: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }),
  }

  constructor(props, context) {
    super(props);
    this.store = context.store;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sys = require('stripes-config'); // eslint-disable-line
    this.okapiUrl = this.sys.okapi.url;
    this.tenant = this.sys.okapi.tenant;
    this.initialValues = { username: '', password: '' };
    this.handleSSOLogin = this.handleSSOLogin.bind(this);
    if (props.autoLogin && props.autoLogin.username) {
      this.handleSubmit(props.autoLogin);
    }
  }

  handleSubmit(data) {
    requestLogin(this.okapiUrl, this.store, this.tenant, data).then((response) => {
      if (response.status >= 400) {
        // eslint-disable-next-line no-param-reassign
        this.initialValues.username = data.username;
      }
    });
  }

  handleSSOLogin() {
    requestSSOLogin(this.okapiUrl, this.tenant);
  }

  render() {
    const { authFailure, ssoEnabled } = this.props;

    const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwEAAAHqCAIAAADTYdUqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0ZCMUZGN0RFMERFMTFFNzkyNDFGRUQ2OTBEOEI3MDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0ZCMUZGN0VFMERFMTFFNzkyNDFGRUQ2OTBEOEI3MDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRkIxRkY3QkUwREUxMUU3OTI0MUZFRDY5MEQ4QjcwNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRkIxRkY3Q0UwREUxMUU3OTI0MUZFRDY5MEQ4QjcwNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PucKUkYAABYISURBVHja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';

    return (
      <Login
        onSubmit={this.handleSubmit}
        authError={authFailure}
        initialValues={this.initialValues}
        handleSSOLogin={this.handleSSOLogin}
        ssoActive={ssoEnabled}
        logoUrl={placeholderImage}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    authFailure: state.okapi.authFailure,
    ssoEnabled: state.okapi.ssoEnabled,
  };
}

export default reduxConnect(mapStateToProps)(LoginCtrl);
