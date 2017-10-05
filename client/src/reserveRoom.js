import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { GridList, GridTile } from 'material-ui/'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import moment from 'moment';

class ReserveRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      roomNo: "",
      roomName: "",
    }
  }

  componentDidMount() {
    this.initRoomList()
  }

  initRoomList() {
    let _this = this;
    axios.get('/api/roomlist', {})
    .then(value => {
      _this.setState({
        search_result: value.data.rooms,
      })
    })
    .catch(err => {
      console.error(err);
    })
  }

  initReserve(row) {
    console.log(row)
    this.setState({
      roomNo: row['roomNo'],
      roomName: row['roomName'],
      date: undefined,
    })
  }

  getBooking(date) {
    let _date = moment(date).format('YYYY-MM-DD');
    axios.get(`/api/bookings?roomNo=${this.state.roomNo}&date=${_date}`, {})
    .then(value => {
      console.log(value);
    })
    .catch(err => {
      console.error(err);
    })
  }

  render() {
    const selectRow = {
      mode: 'radio',
      bgColor: 'pink',
      hideSelectColumn: true,
      clickToSelect: true
    }

    const options = {
      onRowClick: this.initReserve.bind(this)
    }

    return (
      <div>
        <div className="Table" style={{margin: 50}}>
          <span className="subTitle" style={{alignContent: 'center'}}>예약하고 싶은 회의실의 테이블을 클릭해주세요.</span>
          <BootstrapTable
            data={this.state.search_result}
            striped={true}
            pagination
            search
            selectRow={selectRow}
            options={options}
            >
            <TableHeaderColumn dataField="roomNo" isKey={true}>No</TableHeaderColumn>
            <TableHeaderColumn dataField="roomName" >회의실 이름</TableHeaderColumn>
            <TableHeaderColumn dataField="capacity" >수용인원</TableHeaderColumn>
            <TableHeaderColumn dataField="openTime" >개장시간</TableHeaderColumn>
            <TableHeaderColumn dataField="closeTime" >폐장시간</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div style={{margin: 50}}>
        {
          this.state.roomNo ? (
            <GridList cols={12} padding={10}>
              <GridTile cols={3}>
                <strong> 선택한 회의실 : No {this.state.roomNo} / {this.state.roomName} </strong>
                <p>예약할 일자</p>
                <DatePicker
                  hintText="예약하고 싶은 일자"
                  container="inline"
                  onChange={(ev, date) => {this.setState({date: date}); this.getBooking(date)}}
                />
                <div>
                  {this.state.bookings ? (<div></div>) : (<div>예약된 일정이 없습니다.</div>)}
                </div>
              </GridTile>
              { this.state.date ? (
              <GridTile cols={7}>
                <TimePicker>
                  
                </TimePicker>
                <TimePicker>
                  
                </TimePicker>

              </GridTile>) : (<p> 예약할 일자를 선택해주셔야 예약이 가능합니다. </p>)
              }
            </GridList>
          ) : (
            <div>
              우선 원하시는 회의실을 클릭해주세요.
            </div>
          )
        }
        </div>
      </div>
    );
  }
}

export default ReserveRoom;