import { Layout, Tabs } from '@arco-design/web-react';
import { useEditorProps } from 'easy-email-editor';
import React, { useEffect } from 'react';
import { Blocks } from './Blocks';
import { BlockLayer } from '@extensions/BlockLayer';
import { FullHeightOverlayScrollbars } from '@extensions/components/FullHeightOverlayScrollbars';
import styles from './index.module.scss';
import { ConfigurationDrawer } from './ConfigurationDrawer';
import { useExtensionProps } from '@extensions/components/Providers/ExtensionProvider';
// import Frame from '../../../../demo/src/components/Frame'
import templates from '../../../../demo/src/config/templates.json';
import templateList from '../../../../demo/src/store/templateList';
import { CardItem } from '../../../../demo/src/pages/Home/components/CardItem';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../demo/src/hooks/useAppSelector';
import { Stack } from '../../../../demo/src/components/Stack';

const TabPane = Tabs.TabPane;

export function EditPanel({
  showSourceCode,
  jsonReadOnly,
  mjmlReadOnly,
  children,
}: {
  showSourceCode: boolean;
  jsonReadOnly: boolean;
  mjmlReadOnly: boolean;
  children: React.ReactElement;
}) {
  const { height } = useEditorProps();
  const { compact = true } = useExtensionProps();
  console.log('children', children);
  const dispatch = useDispatch();
  const list = useAppSelector('templateList');

  useEffect(() => {
    dispatch(templateList.actions.fetch(undefined));
  }, [dispatch]);

  return (
    <Layout.Sider
      className={styles.blocksPanel}
      style={{ paddingRight: 0, minWidth: 360 }}
      // collapsed={collapsed}
      collapsible
      trigger={null}
      breakpoint='xl'
      collapsedWidth={60}
      width={360}
    >
      <Tabs
        defaultActiveTab='2'
        style={{ width: '100%', padding: 0 }}
        renderTabHeader={(_, DefaultHeader) => (
          <div className={styles.largeTabsHeader}>
            <DefaultHeader />
          </div>
        )}
      >
        <TabPane
          key='2'
          title={t('Block')}
        >
          <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
            <Blocks />
          </FullHeightOverlayScrollbars>
        </TabPane>

        <TabPane
          key='1'
          title={t('Templates')}
        >
          <FullHeightOverlayScrollbars height={`calc(${height} - 60px)`}>
            <Stack>
              {[...templates, ...list].map(item => (
                <CardItem
                  data={item}
                  key={item.article_id}
                />
              ))}
            </Stack>
          </FullHeightOverlayScrollbars>
        </TabPane>
      </Tabs>
      {!compact && (
        <ConfigurationDrawer
          height={height}
          showSourceCode={showSourceCode}
          compact={Boolean(compact)}
          jsonReadOnly={jsonReadOnly}
          mjmlReadOnly={mjmlReadOnly}
        />
      )}
    </Layout.Sider>
  );
}
