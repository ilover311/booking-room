import React from 'react';
import axios from 'axios';
import Auth from './Auth';
import Snackbar from 'material-ui/Snackbar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import './mybooking.css'

class Mybookings extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mybookings: [],
      sb_open: false,
      sb_msg: "",
    }
  }

  componentDidMount() {
    this.initMyBooking()
  }

  initMyBooking() {
    axios.get('/api/mybookings?', Auth.getHeader())
    .then(val => {
      this.setState({mybookings: val.data.bookings})
    })  
    .catch(e => {
      console.error(e)
    })
  }

  initChangeBooking(row) {
    let roomNo = row.roomNo
    axios.get(`/api/room?roomNo=${roomNo}`, Auth.getHeader())
    .then(val => {
      let r = val.data.room
      this.setState({
        bookingID: row.bookingID,
        roomNo: roomNo,
        roomName: r.roomName,
        openTime: r.openTime,
        closeTime: r.closeTime,
        capacity: r.capacity,
      })
    })
    .catch(e => {
      console.error(e)
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
      onRowClick: this.initChangeBooking.bind(this)
    }

    return (
      <div style={{margin: 50}}>
        <div>
          <p> 회의실 사용 시작 시간 전까지 한에서 테이블을 클릭하여 아래에서 정보 수정 및 예약 삭제가 가능합니다.</p>
          <BootstrapTable
            data={this.state.mybookings}
            striped={true}
            pagination
            search
            selectRow={selectRow}
            options={options}>
            <TableHeaderColumn dataField="bookingID" isKey={true}>예약 번호</TableHeaderColumn>
            <TableHeaderColumn dataField="roomNo" >회의실 No</TableHeaderColumn>
            <TableHeaderColumn dataField="date" >일자</TableHeaderColumn>
            <TableHeaderColumn dataField="startTime" >시작시간</TableHeaderColumn>
            <TableHeaderColumn dataField="endTime" >종료시간</TableHeaderColumn>
            <TableHeaderColumn dataField="attendee" >참가자</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div>
          {
            this.state.bookingID ? (
              <div>
                <div className="booking-info">
                <p> 선택된 예약 번호 : { this.state.bookingID } / 선택된 회의실 No : {this.state.roomNo}</p>
                <p> 선택한 회의실 정보 > 개장시간 : {this.state.openTime} / 폐장시간 : {this.state.closeTime} / 수용인원 : {this.state.capacity} </p>
                </div>
                <div className="booking-info">
                  <input type="button"/>
                </div>
              </div>
            ) : (
              <div></div>
            )
          }

        </div>
        <Snackbar
          open={this.state.sb_open}
          message={this.state.sb_msg}
          autoHideDuration={4000}
          onRequestClose={() => {this.setState({ sb_open: false })}}
        />
      </div>
    )
  }
}

export default Mybookings;