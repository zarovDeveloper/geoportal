import { LogOut, Map as MapIcon, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import { useAuthStore } from '@/store/auth';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <MapIcon className={styles.logoIcon} />
        <h2 className={styles.logoText}>Geoportal of Tourist Objects</h2>
      </Link>

      <div className={styles.userSection}>
        <div className={styles.dropdownContainer}>
          <Button
            variant="secondary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={styles.userButton}
          >
            <User className={styles.userIcon} />
            <span className={styles.username}>{user?.username || 'User'}</span>
            <ChevronDown
              className={styles.chevron}
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </Button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <Link
                to="/profile"
                className={styles.dropdownItem}
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className={styles.dropdownIcon} />
                Profile
              </Link>
              <Link
                to="/settings"
                className={styles.dropdownItem}
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className={styles.dropdownIcon} />
                Settings
              </Link>
              <div className={styles.dropdownSeparator} />
              <button
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
              >
                <LogOut className={styles.dropdownIcon} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
