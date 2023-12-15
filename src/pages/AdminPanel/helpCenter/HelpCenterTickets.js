import { MdDelete } from 'react-icons/md'
import Wrapper from '../../Wrapper'
import helpCenterClasses from './HelpCenter.module.css'
import classes from '../Shared.module.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../../components/loader/Loader';
import AddResoulationModal from '../../../components/add-resoulation-modal/AddResoulationModal';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import { format } from 'date-fns';

import 'bootstrap/dist/css/bootstrap.min.css';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const HelpCenterTickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issue, setIssue] = useState({});
  const [allIssues, setAllIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("in-review");
  const [pageCount, setPageCount] = useState(3);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const token = localStorage.getItem("adUx");
  const headers = {
    Authorization: token,
  };

  const getAllIssues = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_ADMIN_API_URL}/get-all-help-list`,
        { status },
        { headers }
      );
      setPageCount(data.totalPage);
      setAllIssues(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllIssues();
  }, [status]);

  const handleDeleteModal = (id) => {
    setIssue(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleSolvedModal = (id) => {
    setIssue(id);
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }
      const { data } = await axios.delete(
        `${process.env.REACT_APP_ADMIN_API_URL}/delete-help-list/${issue}`,
        { headers }
      );
      toast.success("Issue deleted successfully");
      getAllIssues();
      setIsDeleteModalOpen(!isDeleteModalOpen);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = async (page) => {
    setPage(page);
    const { data } = await axios.post(
      `${process.env.REACT_APP_ADMIN_API_URL}/get-all-help-list?page=${page}`, { status }, { headers });
    setAllIssues(data.data);
  };

  return (
    <>
      <Wrapper>
        <div className={classes["report-container"]}>
          <div className={classes["report-header"]}>
            <h1 className={classes["recent-Articles"]}>All Issues</h1>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              name=""
              id=""
            >
              <option value="in-review">In Review</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          <div className={helpCenterClasses.container}>
            {!isLoading && allIssues?.length === 0 && <p>No issues found</p>}

            {isLoading && allIssues?.length === 0 && <Loader />}
            {allIssues?.map((issue) => (
              <div className={helpCenterClasses.helpCenter}>
                <div className={helpCenterClasses.helpCenter_left}>
                  <p>name: {issue?.userId?.name}</p>
                  <p>
                    status:{" "}
                    <span
                      className={
                        status === "in-review"
                          ? helpCenterClasses.under_review
                          : helpCenterClasses.resolved
                      }
                    >
                      {issue.status}
                    </span>
                  </p>
                  <p>issue: {issue.issue}</p>
                  <p>
                    issue date:{" "}
                    {format(new Date(issue.createdAt), "dd-MM-yyyy")}
                  </p>
                  <p>description: {issue.description}</p>
                  {issue.status !== "solved" && (
                    <button
                      onClick={() => handleSolvedModal(issue._id)}
                      className={helpCenterClasses.button}
                    >
                      Mark as resolved
                    </button>
                  )}
                </div>
                <div className={helpCenterClasses.helpCenter_right}>
                  <MdDelete
                    onClick={() => handleDeleteModal(issue._id)}
                    cursor={"pointer"}
                    size={22}
                    color="red"
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            <PaginationControl
              changePage={handlePageClick}
              limit={10}
              page={page}
              total={pageCount + "0"}
            />
          </div>
        </div>
      </Wrapper>

      {isModalOpen && (
        <AddResoulationModal
          setIsModalOpen={setIsModalOpen}
          getAllIssues={getAllIssues}
          id={issue}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          handleDelete={handleDelete}
          setState={setIsDeleteModalOpen}
        />
      )}
    </>
  );
};

export default HelpCenterTickets;