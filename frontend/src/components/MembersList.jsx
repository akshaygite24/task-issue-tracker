import React from 'react';
import '../styles/MembersList.css';

const MembersList = ({ members, projectOwnerId, onRemove }) => {
  if (!members || members.length === 0) {
    return <div className="empty-members">No members yet</div>;
  }

  return (
    <div className="members-list">
      {members.map(member => (
        <div key={member.id} className="member-item">
          <div className="member-info">
            <h4>{member.username}</h4>
            <p>{member.email}</p>
            {member.id === projectOwnerId && (
              <span className="owner-badge">Owner</span>
            )}
          </div>
          {member.id !== projectOwnerId && (
            <button 
              className="btn-remove-member"
              onClick={() => onRemove(member.id)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MembersList;
