import './AllReservations.css';
import Navbar from '../../Navbar/Navbar';
import ToBeFulfilled from "../AllReservations/ToBeFulfilled/ToBeFulfilled";
import ToBeReturned from "../AllReservations/ToBeReturned/ToBeReturned";

const AllReservations = () => {
  return (
    <div className="all-reservations-page">
      <Navbar />
      <div className="reservation-header">
        <h1 className="reservation-title">BOOKS TO BE FULFILLED</h1>
        <div className="title-underline"></div>
      </div>
      <ToBeFulfilled />
       <div className="cards-underline"></div>
      
      <div className="reservation-header">
        <h1 className="reservation-title">BOOKS TO BE RETUNED</h1>
        <div className="title-underline"></div>
      </div>
      <ToBeReturned />
       <div className="cards-underline"></div>

    </div>
  );
};

export default AllReservations;