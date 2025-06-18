import uuid

from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates

from src.geoportal.db.associations import user_role_association
from src.geoportal.db.base_class import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    roles = relationship(
        'Role', secondary=user_role_association, back_populates='users', lazy='select'
    )

    @validates('email')
    def validate_email(self, key, email_address):
        if '@' not in email_address:
            raise ValueError('Failed email validation')
        return email_address.lower()

    @validates('username')
    def validate_username(self, key, username):
        if not username or len(username) < 3:
            raise ValueError('Username must be at least 3 characters long')
        return username

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"
