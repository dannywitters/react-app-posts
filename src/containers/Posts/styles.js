import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

export const Profile = styled.div`
  margin: 50px 0px;
`;

export const ProfilePic = styled.img`
  width: 150px;
  border-radius: 50%;
  box-shadow: 0px 0px 5px #b1b1b1;
  background: #f5f5f5;
  margin-bottom: 20px; 
`;

export const Address = styled.div`
  background: #f1d96e;
  padding: 5px 10px;
  border-radius: 5px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0px 0px 3px 0px #c9c9c9;
  border-radius: 3px;
  margin-bottom: 50px;
  max-width: 760px;
  width: 90%;
  text-align: left;
  overflow: hidden;
  flex-shrink: 0;
`;

export const LikedByRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const LikerLink = styled.a`
  font-size: 0.9em;
  cursor: pointer;
  margin: 5px 0px;
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const FooterLink = styled.a`
  text-decoration: none;
  color: #6e6e6e;

  &:hover {
    color: #333;
  }
`;