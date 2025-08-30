'use client';

import React, { useState } from 'react';
import Tab from '@/components/Tab';
import TabItem from '@/components/TabItem';
import Slider from '@/components/Slider';
import Tag from '@/components/Tag';
import HelpText from '@/components/HelpText';
import StatusLight from '@/components/StatusLight';
import AlertBanner from '@/components/AlertBanner';
import AlertDialog from '@/components/AlertDialog';
import Badge from '@/components/Badge';
import { StarIcon } from '@/components/icons';

const MiscDemo: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h2 mb-6 text-text-primary">Miscellaneous Components</h2>
        <p className="text-body text-text-secondary mb-8">
          다양한 기능을 제공하는 기타 컴포넌트들입니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Tab Components</h3>
          <Tab>
            <TabItem id="home" label="Home">
              <div className="p-4">
                <h4 className="font-medium mb-2">Home Content</h4>
                <p className="text-text-secondary">This is the home tab content.</p>
              </div>
            </TabItem>
            <TabItem id="profile" label="Profile">
              <div className="p-4">
                <h4 className="font-medium mb-2">Profile Content</h4>
                <p className="text-text-secondary">This is the profile tab content.</p>
              </div>
            </TabItem>
            <TabItem id="settings" label="Settings">
              <div className="p-4">
                <h4 className="font-medium mb-2">Settings Content</h4>
                <p className="text-text-secondary">This is the settings tab content.</p>
              </div>
            </TabItem>
          </Tab>
        </div>

        {/* Slider */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Slider Component</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Value: {sliderValue}
              </label>
              <Slider
                minValue={0}
                maxValue={100}
                value={sliderValue}
                onChange={setSliderValue}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Custom Range (20-80)
              </label>
              <Slider
                minValue={20}
                maxValue={80}
                value={50}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Tag Components</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Tag label="Default Tag" />
              <Tag label="With Error" isError />
              <Tag label="Basic Tag" />
              <Tag label="Another Tag" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Tag label="Small" size="small" />
              <Tag label="Medium" size="medium" />
              <Tag label="Large" size="large" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Tag label="Removable" isRemovable onRemove={() => console.log('Removed')} />
              <Tag label="With Avatar" hasAvatar avatar={<StarIcon />} />
            </div>
          </div>
        </div>

        {/* Status Lights */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Status Light Components</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <StatusLight variant="positive" label="Online" />
              <StatusLight variant="negative" label="Offline" />
              <StatusLight variant="notice" label="Warning" />
              <StatusLight variant="neutral" label="Idle" />
            </div>
            <div className="flex gap-4 items-center">
              <StatusLight variant="positive" label="Small" size="small" />
              <StatusLight variant="negative" label="Medium" size="medium" />
              <StatusLight variant="notice" label="Large" size="large" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Badge Components</h3>
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge label="5" variant="blue" />
              <Badge label="New" variant="green" />
              <Badge label="99+" variant="red" />
              <Badge label="Pro" variant="gray" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge label="1" size="small" />
              <Badge label="12" size="medium" />
              <Badge label="123" size="large" />
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Help Text Components</h3>
          <div className="space-y-3">
            <HelpText text="This is a default help text message." />
            <HelpText text="This is an error help text message." variant="negative" />
            <HelpText text="This is a neutral help text message." variant="neutral" />
          </div>
        </div>

        {/* Alert Banner */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Alert Banner Components</h3>
          <div className="space-y-4">
            <AlertBanner
              text="This is an informational alert banner."
              variant="informative"
            />
            <AlertBanner
              text="This is a neutral alert banner."
              variant="neutral"
            />
            <AlertBanner
              text="An error occurred while processing your request."
              variant="negative"
            />
          </div>
        </div>

        {/* Alert Dialog */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Alert Dialog Component</h3>
          <div className="space-y-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowAlert(true)}
            >
              Show Alert Dialog
            </button>
            <AlertDialog
              isOpen={showAlert}
              onClose={() => setShowAlert(false)}
              title="Confirmation"
              description="Are you sure you want to delete this item?"
              primaryActionLabel="Delete"
              secondaryActionLabel="Cancel"
              onPrimaryAction={() => {
                console.log('Confirmed');
                setShowAlert(false);
              }}
              onSecondaryAction={() => setShowAlert(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiscDemo;