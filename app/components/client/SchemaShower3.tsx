import React from 'react';
import { Group, Paper, Box, HoverCard, Text, useMantineTheme } from '@mantine/core';

const CircleSchema = () => {
  const theme = useMantineTheme();

  // Circle styles
  const circleRadius = 40;
  const circle1Color = theme.colors.blue[6];
  const circle2Color = theme.colors.green[6];
  
  return (
    <Paper p="xl" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Box style={{ position: 'relative', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 100px' }}>
        {/* Line connecting circles */}
        <Box 
          style={{
            position: 'absolute',
            top: '50%',
            left: 100 + circleRadius,
            right: 100 + circleRadius,
            height: 2,
            backgroundColor: theme.colors.gray[5],
            zIndex: 1
          }}
        />
        
        {/* First Circle with HoverCard */}
        <HoverCard width={280} shadow="md" withArrow>
          <HoverCard.Target>
            <Box 
              style={{
                width: circleRadius * 2,
                height: circleRadius * 2,
                borderRadius: '50%',
                backgroundColor: circle1Color,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Image
            </Box>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              The are 5400 images in jpg format. 
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
        
        {/* Second Circle with HoverCard */}
        <HoverCard width={280} shadow="md" withArrow>
          <HoverCard.Target>
            <Box 
              style={{
                width: circleRadius * 2,
                height: circleRadius * 2,
                borderRadius: '50%',
                backgroundColor: circle2Color,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Label
            </Box>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              There are 5400 labels in string format.
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Box>
    </Paper>
  );
};

export default CircleSchema;