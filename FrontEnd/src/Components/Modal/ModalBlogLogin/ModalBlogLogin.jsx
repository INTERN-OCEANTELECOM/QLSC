import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';

const ModalBlogLogin = (props) => {
  const { show, dataSignIn } = props;
  const [time, setTime] = useState(0);

  // handle locked time at login
  useEffect(() => {
    if (dataSignIn) {
      const currentTime = new Date().getTime() / 1000;
      const remainingTime = Math.max(dataSignIn - currentTime, 0);
      setTime(remainingTime);
      const interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = Math.max(prevTime - 1, 0);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dataSignIn]);

  if (time === null || time <= 0 || time == 0) {
    return time;
  }

  // format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return ` ${minutes}m ${seconds}s`;
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} animation={false}>
        <Modal.Header>
          <Modal.Title>Tài khoản của bạn tạm thời bị khóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Vui lòng đăng nhập lại sau: <b> {formatTime(time)}</b>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModalBlogLogin