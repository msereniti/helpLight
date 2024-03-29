import { Button, Form, Input, Upload, message, Spin, Avatar, DatePicker, List } from 'antd';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import Axios from 'axios';
import { Link } from 'umi';
import { Volunteer, Organization } from '@/types';

class BaseView extends Component<
  FormComponentProps,
  { volunteer: Volunteer | null; loading: boolean }
> {
  view: HTMLDivElement | undefined = undefined;

  state = { volunteer: null, loading: true };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      this.setState({ volunteer: res.data.volunteer, loading: false });
    });
  }

  render() {
    if (this.state.loading) return <Spin />;
    return (
      <>
        <List
          dataSource={this.state.volunteer.organizations}
          locale={{ emptyText: 'Вы не состоите ни в одной организации' }}
          renderItem={(organization: Organization) => (
            <List.Item>
              <Link to={`organization/${organization.idOrganization}`}>{organization.name}</Link>
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default Form.create()(BaseView);
