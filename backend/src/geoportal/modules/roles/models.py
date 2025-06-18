import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.geoportal.db.associations import user_role_association
from src.geoportal.db.base_class import Base


class Role(Base):
    __tablename__ = 'roles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)

    users = relationship(
        'User', secondary=user_role_association, back_populates='roles', lazy='select'
    )

    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}')>"
