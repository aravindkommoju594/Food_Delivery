import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Our Menu</h1>
      <p className='explore-menu-text'>
        Discover our delicious selection of dishes made with fresh, high-quality ingredients. Browse our menu and find your new favorite today!
      </p>

      <div className='explore-menu-list'>
        {menu_list && menu_list.length > 0 ? (
          menu_list.map((item, index) => (
            <div
              onClick={() =>
                setCategory(prev => (prev === item.menu_name ? 'All' : item.menu_name))
              }
              key={index}
              className='explore-menu-list-item'
            >
              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
