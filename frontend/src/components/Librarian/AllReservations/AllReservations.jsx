import './AllReservations.css';
import Navbar from '../../Navbar/Navbar';
import LibrarianFulfillmentView from "../AllReservations/ToBeFulfilled/ToBeFulfilled"

const AllReservations = () => {

  return (
    <div className="my-books-page">
      <Navbar />
      <LibrarianFulfillmentView ></LibrarianFulfillmentView >
    </div>


       
  );
};

export default AllReservations;