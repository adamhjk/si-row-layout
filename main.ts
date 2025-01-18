// Define the interfaces for ITEMS, COMPONENTS, and FRAMES
interface Item {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Component extends Item {
  type: "COMPONENT";
}

interface Frame extends Item {
  type: "FRAME";
  rows: Item[][];
}

// Utility function to calculate row dimensions
function calculateRowDimensions(row: Item[]): { width: number; height: number } {
  const width = row.reduce((acc, item) => acc + item.width + 50, -50); // Add padding between items
  const height = row.reduce((acc, item) => Math.max(acc, item.height), 0);
  return { width, height };
}

// Recursive function to ensure nested frames have proper layout
function layoutFrame(frame: Frame, offsetX: number = 0, offsetY: number = 0): void {
  console.log(`Laying out frame: ${frame.id}`);
  let currentY = offsetY + 50; // Start with padding at the top

  frame.rows.forEach((row, rowIndex) => {
    console.log(`  Laying out row ${rowIndex} in frame ${frame.id}`);
    const { width: rowWidth, height: rowHeight } = calculateRowDimensions(row);
    console.log(`    Row dimensions - Width: ${rowWidth}, Height: ${rowHeight}`);

    let currentX = offsetX + 50; // Start with padding at the left
    row.forEach(item => {
      console.log(`    Positioning item ${item.id} at x: ${currentX}, y: ${currentY}`);
      item.x = currentX;
      item.y = currentY;
      currentX += item.width + 50; // Add padding between items

      if ((item as Frame).type === "FRAME") {
        layoutFrame(item as Frame, currentX - item.width - 50, currentY); // Recurse into nested frames with corrected position
      }
    });

    currentY += rowHeight + 50; // Add padding between rows
  });

  // Update frame dimensions
  frame.width = frame.rows.reduce((maxWidth, row) => {
    const { width } = calculateRowDimensions(row);
    return Math.max(maxWidth, width);
  }, 0) + 100; // Add padding to the frame width
  frame.height = currentY - offsetY; // Total height with respect to starting y position
  console.log(`  Frame ${frame.id} dimensions - Width: ${frame.width}, Height: ${frame.height}`);
}

// Function to lay out ITEMS, distinguishing between COMPONENTS and FRAMES
function layoutItems(items: Item[]): void {
  console.log("Starting layout of items");
  items.forEach(item => {
    console.log(`Processing item: ${item.id}`);
    if ((item as Frame).type === "FRAME") {
      layoutFrame(item as Frame, item.x, item.y);
    }
  });
  console.log("Completed layout of items");
}

// Function to flatten items from a nested structure
function flattenItems(items: Item[]): Item[] {
  const result: Item[] = [];

  items.forEach(item => {
    result.push(item);
    if ((item as Frame).type === "FRAME") {
      result.push(...flattenItems((item as Frame).rows.flat()));
    }
  });

  return result;
}

// Example usage
const items: Item[] = [
  {
    id: "frame1",
    type: "FRAME",
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    rows: [
      [
        { id: "item1", width: 100, height: 50, x: 0, y: 0 },
        { id: "item2", width: 150, height: 50, x: 0, y: 0 }
      ],
      [
        { id: "item3", width: 200, height: 100, x: 0, y: 0 },
        {
          id: "nestedFrame",
          type: "FRAME",
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          rows: [
            [
              { id: "nestedItem1", width: 80, height: 40, x: 0, y: 0 },
              { id: "nestedItem2", width: 120, height: 60, x: 0, y: 0 }
            ],
            [
              { id: "nestedItem3", width: 100, height: 50, x: 0, y: 0 }
            ]
          ]
        } as Frame
      ]
    ]
  } as Frame
];
