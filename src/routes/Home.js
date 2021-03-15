import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    //오래된 방식의 Nweet
    // const getNweets = async () => {
    //     const dbNweets =  await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // };

    useEffect(() => {
        dbService.collection("nweets").onSnapshot((snapshot) => {
           const nweetArray = snapshot.docs.map((doc) => ({
               id : doc.id,
               ...doc.data(),
            }));
           setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text:nweet,
            createdAt: Date.now(),
            creatotId: userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) => {
        const {target:{value},
        } = event;
        setNweet(value);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatotId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;

//... 은 spread 예를 들면 리스트에 있는 값들을 펼쳐주는것


// authentication 이후의 것들
// home 에서 리스너로 snapshot을 사용하고 았음
// onsnapshot은 기본적으로 데이터베이스에 무슨일이 있을때 알림을 받음
// 새로운 snapshot 을 받을때마다 배열을 만듬
// 그런다음 state에 배열을 집어넣는다
// 그다음 map을 해주고 nweet component를 만든다
// component는 두개의 prop 값을 가진다 .nweetObj랑 isOwner
// 기본적으로 nweetObj는 nweet의 모든 데이터임
// isOwner는 다이내믹헌 값임
// nweet을 만든사람(nweet.creatorld) 과 userObj.uid가 같으면 true를 반환
// 어디에서 userObj.uid가 올까
// userObj is came from Home's props
// 홈의 prop값들은 라우터에서 받음