import React from 'react';
import useDummyAssets from '../../hooks/useDummyAssets';

const AssetComponent = ({ assetName }) => {
  const { getAssetContent } = useDummyAssets();
  const content = getAssetContent(assetName);

  return (
    <div>
      <h1>{assetName}</h1>
      <p>{content}</p>
    </div>
  );
};

export default AssetComponent;
