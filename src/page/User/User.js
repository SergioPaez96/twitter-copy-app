import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import BasicLayout from "../../layout/BasicLayout";
import BannerAvatar from "../../components/User/BannerAvatar";
import InfoUser from "../../components/User/InfoUser";
import ListTweets from "../../components/ListTweets";
import { getUserApi } from "../../api/user";
import { getUserTweetApi } from "../../api/tweet";

import "./User.scss";

function User(props) {
  const { match, setRefreshCheckLogin } = props;
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingTweet, setLoadingTweet] = useState(false);
  const { params } = match;
  const loggedUser = useAuth();

  useEffect(() => {
    getUserApi(params.id)
      .then((response) => {
        if (!response) toast.error("El usuario que has visitado no existe");
        setUser(response);
      })
      .catch(() => {
        toast.error("El usuario que has visitado no existe");
      });
  }, [params]);

  useEffect(() => {
    getUserTweetApi(params.id, 1)
      .then((response) => {
        setTweets(response);
      })
      .catch(() => {
        setTweets([]);
      });
  }, [params]);

  const moreData = () => {
    const pageTemp = page + 1;
    setLoadingTweet(true);

    getUserTweetApi(params.id, pageTemp).then(response => {
      if(!response){
        setLoadingTweet(0);
      } else {
        setTweets([...tweets, ...response]);
        setPage(pageTemp);
        setLoadingTweet(false);
      }
    })
  };

  return (
    <BasicLayout className="user" setRefreshCheckLogin={setRefreshCheckLogin}>
      <div className="user__title">
        <h2>
          {user ? `${user.nombre} ${user.apellidos}` : "Este usuario no existe"}
        </h2>
      </div>
      <BannerAvatar user={user} loggedUser={loggedUser} />
      <InfoUser user={user} />
      <div className="user__tweets">
        <h3>Tweets</h3>
        {tweets && <ListTweets tweets={tweets} />}
        <Button onClick={moreData}>
          {!loadingTweet ? (
            loadingTweet !== 0 && "Obtener m??s tweets"
          ) : (
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              arian-hidden="true"
            />
          )}
        </Button>
      </div>
    </BasicLayout>
  );
}

export default withRouter(User);
