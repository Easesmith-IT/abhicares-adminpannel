import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import AddBtn from "../../assets/add-icon-nobg.png";

import classes from "./Shared.module.css";
import AddUserModal from "../../components/add-user-modal/AddUserModal";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import DeleteModal from "../../components/deleteModal/DeleteModal";

const Customers = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [isMessage, setIsMessage] = useState(false);

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-user`);
      console.log(data);
      setAllUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [])

  const handleOnChange = async (e, id) => {
    if (e.target.checked) {
      try {
        const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/update-user-status/${id}`, { status: true });
        toast.success("Seller status updated");
        getAllUsers();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/update-user-status/${id}`, { status: false });
        toast.success("Seller status updated");
        getAllUsers();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateModal = (seller) => {
    setUser(seller);
    setIsUpdateModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteModal = (id) => {
    setUser(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/delete-user/${user}`);
      console.log(data);
      toast.success("User deleted successfully");
      getAllUsers();
      setIsDeleteModalOpen(!isDeleteModalOpen);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSerach = async (e) => {
    const value = e.target.value;

    try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/search-user?search=${value}`);
        if (data.data.length === 0) {
            setIsMessage(true);
        }
        else {
            setIsMessage(false);
        }
        setAllUsers(data.data);
    } catch (error) {
        console.log(error);
    }
}


function debounce(fx, time) {
    let id = null;
    return function (data) {
        if (id) {
            clearTimeout(id);
        }
        id = setTimeout(() => {
            fx(data);
            // id = null;
        }, time);
    };
}

  return (
    <>
      <div>
        <Header onClick={toggleMenuHandler} />

        <div className={classes["main-container"]}>
          <div
            className={`${classes.navcontainer} ${showMenu ? classes.navclose : ""
              }`}
          >
            <SideNav />
          </div>
          <div className={classes["report-container"]}>
            <div className={classes["report-header"]}>
              <h1 className={classes["recent-Articles"]}>Professionals</h1>
              <input onChange={debounce(handleSerach,1000)} className={classes.input} type="text" placeholder="Search professional" />
              <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                <img src={AddBtn} alt="add product" />
              </button>
            </div>

            <div className={classes["report-body"]}>
              <div className={classes["report-topic-heading"]}>
                <h3 className={classes["t-op"]}>Professional Name</h3>
                <h3 className={classes["t-op"]}>Contact Number</h3>
                <h3 className={classes["t-op"]}>Status</h3>
                <h3 className={classes["t-op"]}>Update/Delete</h3>
              </div>

              <div className={classes.items}>
                {allUsers?.map((user) => (
                  <div key={user._id} className={classes.item1}>
                    <h3 className={classes["t-op-nextlvl"]}>{user.name}</h3>
                    <h3 className={classes["t-op-nextlvl"]}>{user.phone}</h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>
                      <input checked={user.status} onChange={(e) => handleOnChange(e, user._id)} type="checkbox" name="" id="" />
                      {user.status ? "Active" : "InActive"}
                    </h3>
                    <h3 className={`${classes["t-op-nextlvl"]}`}>
                      <FiEdit onClick={() => handleUpdateModal(user)} cursor={"pointer"} size={20} />
                      <MdDelete onClick={() => handleDeleteModal(user._id)} cursor={"pointer"} size={22} color='red' />
                    </h3>
                  </div>
                ))}

                {isMessage && <p>no result found</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen &&
        <AddUserModal
          setIsModalOpen={setIsModalOpen}
          getAllUsers={getAllUsers}
        />
      }

      {isUpdateModalOpen &&
        <AddUserModal
          setIsModalOpen={setIsUpdateModalOpen}
          user={user}
          getAllUsers={getAllUsers}
        />
      }

      {isDeleteModalOpen &&
        <DeleteModal
          setState={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      }
    </>
  );
};

export default Customers;
