import React, { useState, useEffect, useCallback } from 'react';
import { gql, useQuery } from "@apollo/client";
import { LINKS, MOKA_LINKS, MAINNETINFURA } from 'constants/constants';
import { GET_MOKA_POST } from 'gql/queries';
import { getENS } from 'ens-lookup';
import { GET_USER_UPVOTES_IDS } from 'gql/queries';

//WEB3
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';

//COMPONENTS
import Post from 'components/Post';
import Love from 'assets/svgs/love';

import Notifications from 'components/Notifications';
import Errors from 'components/Errors';

//STYLES
import { Wrap, Profile, ProfilePic, Address, Body, LikedByRow, LikerLink, FooterLink } from './styles';

const NFT_API = 'https://use.nifti.es/api/:id';
const IPFS_API = 'https://ipfs.io/ipfs/:id';

function Posts(props) {
  const id = props.match.params.id;
  const [userUpvotes, setUserUpvotes] = useState([]);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [txError, setTxError] = useState(null);
  const { account, error } = useEthers();
  const { data: voteData, refetch } = useQuery(gql(GET_USER_UPVOTES_IDS), { variables: { id: account && account.toString().toLowerCase() }, skip: !account });

  const [ensLoaded, setEnsLoaded] = useState(false);
  const [ensData, setEnsData] = useState(null);
  const [profileURL, setProfileURL] = useState(null);

  const { data } = useQuery(gql(GET_MOKA_POST), { variables: { id } });

  useEffect(() => {
    async function getENSData() {
      const etherscanProvider = new ethers.providers.JsonRpcProvider(MAINNETINFURA);
      const name = await etherscanProvider.lookupAddress(data.post.user.id);

      if (name) {
        const ensData = await getENS(etherscanProvider)(name);
        setEnsData(ensData);

        if(ensData.records && ensData.records.avatar) {
          if (ensData.records.avatar.startsWith('eip155')) {
            fetch(NFT_API.replace(':id', ensData.records.avatar))
                .then(response => response.json())
                .then(data => {
                  if (data.metadata.image) {
                    setProfileURL(data.metadata.image);
                  }
                });
          } else if (ensData.records.avatar.startsWith('ipfs')) {
            setProfileURL(IPFS_API.replace(':id', ensData.records.avatar.split('://')[1]));
          }
        }
      }
    }

    if (data && data.post && data.post.user && ensLoaded === false) {
      setEnsLoaded(true);
      try { getENSData(); } catch(e) { }
    }
  }, [data, ensLoaded]);

  //REFETCH ACCOUNT UPVOTES
  useEffect(() => {
    if (voteData) {
      if (voteData && voteData.user && voteData.user.upvotes && voteData.user.upvotes.length > 0 && voteData.user.id === account.toString().toLowerCase()) {
        let upvotes = [];
        for (var i = 0; i < voteData.user.upvotes.length; i++) {
          upvotes.push(voteData.user.upvotes[i].postId);
        }
        setUserUpvotes(upvotes);
      } else {
        setUserUpvotes([]);
      }
    } else {
      setUserUpvotes([]);
    }

    if (account && voteData && voteData.user) {
      if (account.toString().toLowerCase() !== voteData.user.id) {
        refetch();
      }
    }
  },[voteData, account, refetch]);

  //WRONG NETWORK
  useEffect(() => {
    if (
      (error && error.message && error.message.toLowerCase().replace(/\s/g, '').includes('unsupportedchain')) ||
      (error && error.name === 'UnsupportedChainIdError')
    ) {
      setWrongNetwork(true);
    }
  },[error]);

  const onTxErrorCallback = useCallback(error => {
    setTxError(error);
    setTimeout(function(){ setTxError(null); }, 2000);
  }, []);

  return (
    <Wrap>
      {
        data && data.post &&
        <React.Fragment>
          <Profile>
            {
              !ensData &&
              <Address>{data.post.user.id}</Address>
            }
            {
              ensData &&
              <React.Fragment>
                {
                  profileURL &&
                  <ProfilePic alt="profile" src={profileURL} />
                }
                <Address>{ensData.domain}</Address>
              </React.Fragment>
            }
          </Profile>
          <Body>
            <Post account={account} userUpvotes={userUpvotes} item={data.post} txErrorCallback={onTxErrorCallback} />
          </Body>
          {
            data.post.upvotedUsers && data.post.upvotedUsers.length > 0 &&
            <div>
              <LikedByRow><Love fill={true} size="16px" />&nbsp;Liked by</LikedByRow>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                  data.post.upvotedUsers.map((item, index) =>
                    <LikerLink key={index} href={MOKA_LINKS[process.env.REACT_APP_ENV].user + item.voterId} target="_blank">{item.voterId}</LikerLink>
                  )
                }
              </div>
            </div>
          }
          {
            (txError || wrongNetwork) &&
            <Errors error={wrongNetwork ? 'wrong_network' : txError} />
          }
          {
            !txError && !wrongNetwork &&
            <Notifications pageLoadTime={props.pageLoadTime} />
          }
          <div style={{ flexShrink: '0', width: '100%', marginTop: 'auto', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FooterLink href={LINKS.ABOUT} target="_blank" rel="noreferrer">About Moka</FooterLink>
            <div style={{ margin: '0 10px' }}>·</div>
            <FooterLink href="https://www.ethereum.org" target="_blank" rel="noreferrer">Built on ♦</FooterLink>
            <div style={{ margin: '0 10px' }}>·</div>
            {
              process.env.REACT_APP_ENV === 'ROPSTEN' &&
              <div style={{ color: '#6e6e6e' }}>Ropsten Network</div>
            }
            {
              process.env.REACT_APP_ENV === 'MATIC' &&
              <div style={{ color: '#6e6e6e' }}>Polygon Network</div>
            }
          </div>
        </React.Fragment>
      }
    </Wrap>
  );
}

export default Posts;