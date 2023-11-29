import classes from './DeleteModal.module.css'

const DeleteModal = ({ setState, handleDelete }) => {
    return (
        <div className={classes.modal_wrapper}>
            <div className={classes.modal}>
                <p>Are you sure to delete ?</p>
                <div className={classes.button_wrapper}>
                    <button onClick={handleDelete} className={classes.button}>Yes</button>
                    <button onClick={() => setState(false)} className={classes.button}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal